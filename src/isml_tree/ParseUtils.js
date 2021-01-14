
/**
 * The functions defined in this file do not create or modify a state, they
 * simply analyze it and return relevant information;
 */

const path           = require('path');
const Constants      = require('../Constants');
const ExceptionUtils = require('../util/ExceptionUtils');
const SfccTags       = require('../enums/SfccTags');
const GeneralUtils   = require('../util/GeneralUtils');
const MaskUtils      = require('./MaskUtils');

const getNextNonEmptyChar = content => {
    return content.replace(new RegExp(Constants.EOL, 'g'), '').trim()[0];
};

const getCharOccurrenceQty = (string, char) => (string.match(new RegExp(char, 'g')) || []).length;

const getLineBreakQty = string => getCharOccurrenceQty(string, Constants.EOL);

const getNextNonEmptyCharPos = content => {
    const firstNonEmptyChar = getNextNonEmptyChar(content);
    const index             = content.indexOf(firstNonEmptyChar);

    return Math.max(index, 0);
};

const getLeadingEmptyChars = string => {
    const leadingBlankSpacesQty = getNextNonEmptyCharPos(string);

    return string.substring(0, leadingBlankSpacesQty);
};

const getLeadingLineBreakQty = string => {
    const leadingString = getLeadingEmptyChars(string);

    return this.getLineBreakQty(leadingString);
};

const checkBalance = (node, templatePath) => {

    for (let i = 0; i < node.children.length; i++) {
        checkBalance(node.children[i]);
    }

    if (!node.isRoot() &&
        node.parent && !node.parent.isContainer() &&
        (node.isHtmlTag() || node.isIsmlTag()) &&
        !node.isSelfClosing() && !node.suffixValue
        && !node.parent.isOfType('iscomment')
    ) {
        throw ExceptionUtils.unbalancedElementError(
            node.getType(),
            node.lineNumber,
            node.globalPos,
            node.value.trim().length,
            templatePath
        );
    }
};

const parseNextElement = state => {
    const newElement = getNewElement(state);
    processLeadingHardCodedTexts(state, newElement);

    const trimmedElement  = newElement.value.trim();
    const previousElement = state.elementList[state.elementList.length - 1] || {};

    if (previousElement.tagType === 'iscomment' && !previousElement.isClosingTag && trimmedElement !== '</iscomment>') {
        newElement.lineNumber    = getLineBreakQty(state.pastContent) + getLeadingLineBreakQty(newElement.value) + 1;
        newElement.globalPos     = state.pastContent.length - newElement.value.length + getLeadingEmptyChars(newElement.value).length;
        newElement.type          = 'text';
        newElement.isSelfClosing = true;

        // TODO: Maybe there is a better way of checking this?
        if (global.isWindows) {
            newElement.globalPos -= getLineBreakQty(newElement.value);
        }
    } else {
        trimmedElement.startsWith('<') || trimmedElement.startsWith('${') ?
            parseTagOrExpressionElement(state, newElement) :
            parseTextElement(state, newElement);
    }

    if (global.isWindows) {
        newElement.globalPos += newElement.lineNumber - 1;
    }

    state.elementList.push(newElement);

    return newElement;
};

const processLeadingHardCodedTexts = (state, newElement) => {
    if (state.remainingShadowContent.substring(0, state.nextOpeningTagOrExpressionInitPos - 1).trim().length > 0) {
        state.cutSpot = state.remainingShadowContent.substring(0, state.nextOpeningTagOrExpressionInitPos - 1).length;

        state.nextClosingTagOrExpressionEndPos = state.nextOpeningTagOrExpressionInitPos;
        newElement.value                       = state.remainingContent.substring(0, state.cutSpot);

        state.remainingShadowContent = state.remainingShadowContent.substring(state.cutSpot);
        state.remainingContent       = state.remainingContent.substring(state.cutSpot);
        state.pastContent            = state.originalContent.substring(0, state.pastContent.length + state.cutSpot);
    }
};

const parseTagOrExpressionElement = (state, newElement) => {
    const trimmedElement      = newElement.value.trim();
    const isTag               = trimmedElement.startsWith('<') && !trimmedElement.startsWith('<!--');
    const isExpression        = trimmedElement.startsWith('${');
    const isHtmlOrIsmlComment = trimmedElement.startsWith('<!--');

    newElement.value = state.remainingContent.substring(0, state.nextClosingTagOrExpressionEndPos);

    if (isTag) {
        if (trimmedElement.startsWith('<is') || trimmedElement.startsWith('</is')) {
            newElement.type = 'ismlTag';
        } else if (trimmedElement.startsWith('<!DOCTYPE')) {
            newElement.type = 'doctype';
        } else {
            newElement.type = 'htmlTag';
        }
    } else if (isHtmlOrIsmlComment) {
        newElement.type = 'htmlOrIsmlComment';
    } else if (isExpression) {
        newElement.type = 'expression';
    } else {
        newElement.type = 'text';
    }

    if (isTag) {
        newElement.tagType = getElementType(trimmedElement);
    }

    newElement.isSelfClosing = isSelfClosing(trimmedElement);

    newElement.isClosingTag = isTag && trimmedElement.startsWith('</');
    newElement.lineNumber   = getLineBreakQty(state.pastContent) + getLeadingLineBreakQty(newElement.value) + 1;
    newElement.globalPos    = state.pastContent.length + getLeadingEmptyChars(newElement.value).length;
};

const parseTextElement = (state, newElement) => {
    newElement.type          = 'text';
    newElement.lineNumber    = getLineBreakQty(state.pastContent.substring(0, state.pastContent.length - state.cutSpot))
        + getLeadingLineBreakQty(newElement.value) + 1;
    newElement.globalPos     = state.pastContent.length - state.cutSpot + getLeadingEmptyChars(newElement.value).length;
    newElement.isSelfClosing = true;
};

const getElementType = trimmedElement => {
    if (trimmedElement.startsWith('</')) {
        const suffixElementType = trimmedElement.slice(2, -1);

        if (suffixElementType.startsWith('${')) {
            return 'dynamic_element';
        }

        return suffixElementType;
    } else {

        const typeValueLastPos = Math.min(...[
            trimmedElement.indexOf(' '),
            trimmedElement.indexOf('/'),
            trimmedElement.indexOf('>')
        ].filter(j => j !== -1));

        const elementType = trimmedElement.substring(1, typeValueLastPos).trim();

        if (elementType.startsWith('${')) {
            return 'dynamic_element';
        }

        return elementType;
    }
};

function isSelfClosing(trimmedElement) {
    const ConfigUtils = require('../util/ConfigUtils');

    const config               = ConfigUtils.load();
    const isTag                = trimmedElement.startsWith('<') && !trimmedElement.startsWith('<!--');
    const elementType          = getElementType(trimmedElement);
    const isDocType            = trimmedElement.toLowerCase().startsWith('<!doctype ');
    const isVoidElement        = !config.disableHtml5 && Constants.voidElementsArray.indexOf(elementType) >= 0;
    const isHtmlComment        = trimmedElement.startsWith('<!--') && trimmedElement.endsWith('-->');
    const isClosingTag         = trimmedElement.endsWith('/>');
    const isIsmlTag            = trimmedElement.startsWith('<is');
    const isStandardIsmlTag    = !!SfccTags[elementType];
    const isCustomIsmlTag      = isIsmlTag && !isStandardIsmlTag;
    const isExpression         = trimmedElement.startsWith('${') && trimmedElement.endsWith('}');
    const isSfccSelfClosingTag = SfccTags[elementType] && SfccTags[elementType]['self-closing'];

    // 'isif' tag is never self-closing;
    if (['isif'].indexOf(elementType) >= 0) {
        return false;
    }

    return isDocType ||
        isVoidElement ||
        isExpression ||
        isHtmlComment ||
        isTag && isClosingTag ||
        isCustomIsmlTag ||
        isIsmlTag && isSfccSelfClosingTag;
}

const getNextOpeningTagOrExpressionInitPos = content => {
    return Math.min(...[
        content.indexOf('<'),
        content.indexOf('<--'),
        content.indexOf('${')
    ].filter(j => j !== -1)) + 1;
};

const getNextClosingTagOrExpressionEndPos = content => {
    return Math.min(...[
        content.indexOf('>'),
        content.indexOf('-->'),
        content.indexOf('}')
    ].filter(j => j !== -1)) + 1;
};

const getInitialState = (templateContent, templatePath) => {
    const originalContent       = GeneralUtils.toLF(templateContent);
    const originalShadowContent = MaskUtils.maskIgnorableContent(originalContent, null, templatePath);

    return {
        templatePath           : templatePath,
        templateName           : path.basename(templatePath),
        originalContent        : originalContent,
        originalShadowContent  : originalShadowContent,
        remainingContent       : originalContent,
        remainingShadowContent : originalShadowContent,
        pastContent            : '',
        elementList            : [],
        cutSpot                : null
    };
};

const initLoopState = state => {
    state.nextOpeningTagOrExpressionInitPos = getNextOpeningTagOrExpressionInitPos(state.remainingShadowContent);
    state.nextClosingTagOrExpressionEndPos  = getNextClosingTagOrExpressionEndPos(state.remainingShadowContent);
    state.cutSpot                           = null;
};

const finishLoopState = state => {
    const newElement = state.elementList[state.elementList.length - 1];

    // If there is no element left (only blank spaces and / or line breaks);
    if (!isFinite(state.nextClosingTagOrExpressionEndPos)) {
        state.nextClosingTagOrExpressionEndPos = state.remainingShadowContent.length - 1;
    }

    if (!state.cutSpot) {
        state.remainingShadowContent = state.remainingShadowContent.substring(newElement.value.length);
        state.remainingContent       = state.remainingContent.substring(newElement.value.length);
        state.pastContent            = state.originalContent.substring(0, state.pastContent.length + newElement.value.length);
    }
};

const mergeTrailingSpacesWithLastElement = state => {
    const elementList       = state.elementList;
    const lastElement       = elementList[elementList.length - 1];
    const secondLastElement = elementList[elementList.length - 2];

    if (lastElement.value.trim().length === 0) {
        secondLastElement.value += lastElement.value;
        elementList.pop();
    }
};

const adjustTrailingSpaces = state => {

    // Note that last element is not iterated over;
    for (let i = 0; i < state.elementList.length - 1; i++) {
        const previousElement = i > 0 ? state.elementList[i - 1] : null;
        const currentElement  = state.elementList[i];

        if (currentElement.type === 'text'
            && previousElement
            && previousElement.lineNumber !== currentElement.lineNumber
            && previousElement.tagType !== 'isscript'
        ) {

            const trailingSpacesQty = currentElement.value
                .replace(/\r\n/g, '_')
                .split('')
                .reverse()
                .join('')
                .search(/\S/);

            if (trailingSpacesQty > 0) {
                const trailingSpaces = currentElement.value.slice(-trailingSpacesQty);

                currentElement.value = currentElement.value.slice(0, -trailingSpacesQty);
                const nextElement    = state.elementList[i + 1];
                nextElement.value    = trailingSpaces + nextElement.value;
            }
        }
    }
};

const getNewElement = state => {
    let lastContiguousMaskedCharPos;
    for (let i = 0; i < state.remainingShadowContent.length; i++) {
        if (state.remainingShadowContent[i] !== '_') {
            lastContiguousMaskedCharPos = i;
            break;
        }
    }

    const elementValue = state.remainingShadowContent.startsWith('_') ?
        state.remainingContent.substring(0, lastContiguousMaskedCharPos) :
        state.remainingContent.substring(0, state.nextClosingTagOrExpressionEndPos);

    return {
        value         : elementValue,
        type          : undefined,
        globalPos     : undefined,
        lineNumber    : undefined,
        isSelfClosing : undefined,
        isClosingTag  : undefined,
        tagType       : undefined
    };
};

const getElementList = (templateContent, templatePath) => {

    const state       = getInitialState(templateContent, templatePath);
    const elementList = state.elementList;

    do {
        initLoopState(state);
        parseNextElement(state);
        finishLoopState(state);
    } while (state.remainingShadowContent.length > 0);

    adjustTrailingSpaces(state);
    mergeTrailingSpacesWithLastElement(state);

    return elementList;
};

module.exports.getElementList         = getElementList;
module.exports.checkBalance           = checkBalance;
module.exports.getLineBreakQty        = getLineBreakQty;
module.exports.getCharOccurrenceQty   = getCharOccurrenceQty;
module.exports.getNextNonEmptyCharPos = getNextNonEmptyCharPos;
module.exports.getLeadingEmptyChars   = getLeadingEmptyChars;
module.exports.getLeadingLineBreakQty = getLeadingLineBreakQty;
