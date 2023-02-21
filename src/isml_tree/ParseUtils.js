
/**
 * The functions defined in this file do not create or modify a state, they
 * simply analyze it and return relevant information;
 */

const path             = require('path');
const Constants        = require('../Constants');
const ExceptionUtils   = require('../util/ExceptionUtils');
const SfccTagContainer = require('../enums/SfccTagContainer');
const GeneralUtils     = require('../util/GeneralUtils');
const MaskUtils        = require('./MaskUtils');

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

const getElementColumnNumber = (newElement, state) => {
    if (newElement.value.indexOf(Constants.EOL) >= 0) {
        const firstNonEmptyCharPos = getNextNonEmptyCharPos(newElement.value);

        return firstNonEmptyCharPos === 0 ?
            1 :
            newElement.value
                .substring(0, firstNonEmptyCharPos)
                .split('').reverse().join('')
                .indexOf(Constants.EOL) + 1;

    } else if (state.elementList.length === 0) {
        return getNextNonEmptyCharPos(newElement.value) + 1;
    } else {
        let columnNumber = 1;

        for (let i = state.elementList.length - 1; i >= 0; i--) {
            const element = state.elementList[i];

            if (element.value.indexOf(Constants.EOL) >= 0) {
                columnNumber += element.value.length - 1;
                break;

            } else if (i === 0) {
                columnNumber += element.value.length + 1;
                break;

            } else {
                columnNumber += element.value.length;
            }
        }

        return columnNumber;
    }
};

const getLeadingLineBreakQty = string => {
    const leadingString = getLeadingEmptyChars(string);

    return this.getLineBreakQty(leadingString);
};

const getTrailingEmptyCharsQty = string => {
    const invertedString = string.split('').reverse().join('').replace(Constants.EOL, '_');

    return Math.max(getLeadingEmptyChars(invertedString).length, 0);
};

const checkBalance = (node, templatePath) => {

    for (let i = 0; i < node.children.length; i++) {
        checkBalance(node.children[i]);
    }

    if (!node.isRoot() &&
        node.parent && !node.parent.isContainer() &&
        (node.isHtmlTag() || node.isIsmlTag()) &&
        !node.isSelfClosing() && !node.tail
        && !node.parent.isOfType('iscomment')
    ) {
        throw ExceptionUtils.unbalancedElementError(
            node.getType(),
            node.lineNumber,
            node.globalPos,
            node.head.trim().length,
            templatePath
        );
    }
};

const parseNextElement = state => {
    const ConfigUtils = require('../util/ConfigUtils');

    const config     = ConfigUtils.load();
    const newElement = getNewElement(state);

    const trimmedElement     = newElement.value.trim();
    const previousElement    = state.elementList[state.elementList.length - 1] || {};
    const isIscommentContent = previousElement.tagType === 'iscomment' && !previousElement.isClosingTag && trimmedElement !== '</iscomment>';
    const isIsscriptContent  = previousElement.tagType === 'isscript' && !previousElement.isClosingTag && trimmedElement !== '</isscript>';

    if (isIsscriptContent || isIscommentContent) {
        newElement.lineNumber    = getLineBreakQty(state.pastContent) + getLeadingLineBreakQty(newElement.value) + 1;
        newElement.globalPos     = state.pastContent.length + getLeadingEmptyChars(newElement.value).length;
        newElement.type          = 'text';
        newElement.isSelfClosing = true;

        if (state.isCrlfLineBreak && isIscommentContent) {
            newElement.globalPos -= getLineBreakQty(newElement.value);
        }
    } else {
        trimmedElement.startsWith('<') || trimmedElement.startsWith('${') ?
            parseTagOrExpressionElement(state, newElement) :
            parseTextElement(state, newElement);
    }

    newElement.columnNumber  = getElementColumnNumber(newElement, state);
    newElement.isVoidElement = !config.disableHtml5 && Constants.voidElementsArray.indexOf(newElement.tagType) >= 0;

    if (state.isCrlfLineBreak) {
        newElement.globalPos += newElement.lineNumber - 1;
    }

    state.elementList.push(newElement);

    if (newElement.type === 'htmlTag' && newElement.value.indexOf('<isif') >= 0 && newElement.value.indexOf('</isif') < 0) {
        throw ExceptionUtils.invalidNestedIsifError(
            newElement.tagType,
            newElement.lineNumber,
            newElement.globalPos,
            state.templatePath
        );
    } else if (newElement.value.trim() === '>') {
        throw ExceptionUtils.invalidCharacterError(
            '>',
            newElement.lineNumber,
            newElement.globalPos,
            1,
            state.templatePath
        );
    }

    return newElement;
};

const parseTagOrExpressionElement = (state, newElement) => {
    const trimmedElement       = newElement.value.trim().toLowerCase();
    const isTag                = trimmedElement.startsWith('<') && !trimmedElement.startsWith('<!--');
    const isExpression         = trimmedElement.startsWith('${');
    const isHtmlOrIsmlComment  = trimmedElement.startsWith('<!--');
    const isConditionalComment = trimmedElement.indexOf('<!--[if') >= 0 || trimmedElement.indexOf('<![endif') >= 0;

    if (isTag) {
        if (trimmedElement.startsWith('<is') || trimmedElement.startsWith('</is')) {
            newElement.type = 'ismlTag';
        } else if (trimmedElement.startsWith('<!DOCTYPE')) {
            newElement.type = 'doctype';
        } else {
            newElement.type = 'htmlTag';
        }
    } else if (isConditionalComment) {
        newElement.type = 'htmlConditionalComment';
    } else if (isHtmlOrIsmlComment) {
        newElement.type = 'htmlOrIsmlComment';
    } else if (isExpression) {
        newElement.type = 'expression';
    } else {
        newElement.type = 'text';
    }

    if (isTag) {
        newElement.tagType     = getElementType(trimmedElement);
        newElement.isCustomTag = newElement.type === 'ismlTag' && !SfccTagContainer[newElement.tagType];
    }

    newElement.isSelfClosing = isSelfClosing(trimmedElement);
    newElement.isClosingTag  = isTag && trimmedElement.startsWith('</');
    newElement.lineNumber    = getLineBreakQty(state.pastContent) + getLeadingLineBreakQty(newElement.value) + 1;
    newElement.globalPos     = state.pastContent.length + getLeadingEmptyChars(newElement.value).length;

    // TODO Refactor this, remove this post-processing;
    if (newElement.type === 'htmlConditionalComment') {
        newElement.tagType       = 'html_conditional_comment';
        newElement.isSelfClosing = newElement.value.indexOf('<!--[if') >= 0 && newElement.value.indexOf('<![endif') >= 0;

        if (trimmedElement.indexOf('<!--<![endif]') >= 0) {
            newElement.isClosingTag = true;
        }
    }
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
        const tailElementType = trimmedElement.slice(2, -1);

        if (tailElementType.startsWith('${')) {
            return 'dynamic_element';
        }

        return tailElementType;
    } else {

        const typeValueLastPos = Math.min(...[
            trimmedElement.indexOf(' '),
            trimmedElement.indexOf('/'),
            trimmedElement.indexOf(Constants.EOL),
            trimmedElement.indexOf('>')
        ].filter(j => j >= 0));

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
    const isStandardIsmlTag    = !!SfccTagContainer[elementType];
    const isCustomIsmlTag      = isIsmlTag && !isStandardIsmlTag;
    const isExpression         = trimmedElement.startsWith('${') && trimmedElement.endsWith('}');
    const isSfccSelfClosingTag = SfccTagContainer[elementType] && SfccTagContainer[elementType]['self-closing'];

    // 'isif' tag is never self-closing;
    if (['isif'].indexOf(elementType) >= 0) {
        return false;
    }

    return !!(isDocType ||
        isVoidElement ||
        isExpression ||
        isHtmlComment ||
        isTag && isClosingTag ||
        isCustomIsmlTag ||
        isIsmlTag && isSfccSelfClosingTag);
}

const getNextOpeningTagOrExpressionInitPos = content => {
    return Math.min(...[
        content.indexOf('<'),
        content.indexOf('<--'),
        content.indexOf('${')
    ].filter(j => j >= 0)) + 1;
};

const getNextClosingTagOrExpressionEndPos = content => {
    return Math.min(...[
        content.indexOf('>'),
        content.indexOf('-->'),
        content.indexOf('}')
    ].filter(j => j >= 0)) + 1;
};

const getInitialState = (templateContent, templatePath, isCrlfLineBreak) => {
    // TODO Check if "GeneralUtils.toLF" can be removed;
    const originalContent       = GeneralUtils.toLF(templateContent);
    const originalShadowContent = MaskUtils.maskIgnorableContent(originalContent, null, templatePath);

    return {
        templatePath           : templatePath,
        templateName           : templatePath ? path.basename(templatePath) : '',
        originalContent        : originalContent,
        originalShadowContent  : originalShadowContent,
        remainingContent       : originalContent,
        remainingShadowContent : originalShadowContent,
        pastContent            : '',
        elementList            : [],
        cutSpot                : null,
        isCrlfLineBreak
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

// TODO Refactor this function;
const checkIfNextElementIsATagOrHtmlComment = (content, state) => {
    const previousElementType = state.elementList.length > 0 && state.elementList[state.elementList.length - 1].tagType;
    const isIscommentContent  = previousElementType === 'iscomment';
    const isIsscriptContent   = previousElementType === 'isscript';
    const isScriptContent     = previousElementType === 'script';

    return !isIscommentContent && !isScriptContent && !isIsscriptContent && content.startsWith('<') && content.substring(1).match(/^[A-z]/i) || content.startsWith('</') || content.startsWith('<!');
};

const getWrapperTagContent = (state, wrapperTagType) => {
    for (let i = 0; i < state.remainingContent.length; i++) {
        const remainingString = state.remainingContent.substring(i);

        if (remainingString.startsWith(`</${wrapperTagType}>`)) {
            return state.remainingContent.substring(0, i);
        }
    }

    return state.remainingContent;
};

const checkIfCurrentElementWrappedByTag = (state, wrapperTagType) => {
    let depth = 0;

    for (let i = state.elementList.length - 1; i >= 0 ; i--) {
        const element = state.elementList[i];

        if (element.tagType === wrapperTagType) {
            depth += element.isClosingTag ? -1 : 1;
        }
    }

    return depth > 0 && !state.remainingContent.trimStart().startsWith(`</${wrapperTagType}>`);
};

const getTextLastContiguousMaskedCharPos = (state, isNextElementATag, isNextElementAnExpression) => {
    const localMaskedContent0 = MaskUtils.maskExpressionContent(state.remainingContent);
    const localMaskedContent1 = MaskUtils.maskInBetween(localMaskedContent0, '<', '>');

    for (let i = 0; i < localMaskedContent1.length; i++) {
        if (isNextElementATag && localMaskedContent1[i] === '>') {
            return i + 1;
        }

        if (isNextElementAnExpression && localMaskedContent1[i] === '}') {
            return i + 1;
        }
    }
};

// TODO Refactor this function
const getNewElement = state => {

    const trimmedContent            = state.remainingContent.trimStart();
    const isWithinIscomment         = checkIfCurrentElementWrappedByTag(state, 'iscomment');
    const isWithinIsscript          = checkIfCurrentElementWrappedByTag(state, 'isscript');
    const isNextElementATag         = trimmedContent.startsWith('<');
    const isNextElementAnExpression = trimmedContent.startsWith('${');
    const isTextElement             = !isNextElementATag && !isNextElementAnExpression;
    let lastContiguousMaskedCharPos;
    let elementValue;

    if (isWithinIscomment) {
        elementValue = getWrapperTagContent(state, 'iscomment');

    } else if (isWithinIsscript) {
        elementValue = getWrapperTagContent(state, 'isscript');

    } else if (isTextElement) {

        for (let i = 0; i < state.remainingContent.length; i++) {
            const remainingString                = state.remainingContent.substring(i);
            const isNextElementATagOrHtmlComment = checkIfNextElementIsATagOrHtmlComment(remainingString, state);

            if (isNextElementATagOrHtmlComment || remainingString.startsWith('${')) {
                lastContiguousMaskedCharPos = i;
                break;
            }
        }

        elementValue = state.remainingContent.substring(0, lastContiguousMaskedCharPos);
    } else {
        if (state.elementList.length > 0 && state.elementList[state.elementList.length - 1].type === 'text') {

            lastContiguousMaskedCharPos = getTextLastContiguousMaskedCharPos(state, isNextElementATag, isNextElementAnExpression);
        } else {
            let remainingMaskedContent = state.remainingContent;

            if (isNextElementATag) {
                remainingMaskedContent = MaskUtils.maskExpressionContent(remainingMaskedContent);
                remainingMaskedContent = MaskUtils.maskQuoteContent(remainingMaskedContent);
            }

            for (let i = 0; i < remainingMaskedContent.length; i++) {
                if (isNextElementATag && remainingMaskedContent[i] === '>') {
                    lastContiguousMaskedCharPos = i + 1;
                    break;
                }
            }
        }

        elementValue = state.remainingShadowContent.startsWith('_') ?
            state.remainingContent.substring(0, lastContiguousMaskedCharPos) :
            state.remainingContent.substring(0, state.nextClosingTagOrExpressionEndPos);
    }

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

const getElementList = (templateContent, templatePath, isCrlfLineBreak) => {

    const state              = getInitialState(templateContent, templatePath, isCrlfLineBreak);
    const elementList        = state.elementList;
    let previousStateContent = state.remainingShadowContent;

    if (templateContent === '') {
        return [];
    }

    do {
        initLoopState(state);
        parseNextElement(state);
        finishLoopState(state);

        if (previousStateContent.length === state.remainingShadowContent.length) {
            throw ExceptionUtils.unkownError(templatePath);
        }

        previousStateContent = state.remainingShadowContent;

    } while (state.remainingShadowContent.length > 0);

    adjustTrailingSpaces(state);
    mergeTrailingSpacesWithLastElement(state);

    return elementList;
};

const getBlankSpaceString = length => {
    let result = '';

    for (let i = 0; i < length; i++) {
        result += ' ';
    }

    return result;
};

const getColumnNumber = content => {
    const leadingContent       = content.substring(0, getNextNonEmptyCharPos(content));
    const lastLineBreakPos     = leadingContent.lastIndexOf(Constants.EOL);
    const precedingEmptySpaces = leadingContent.substring(lastLineBreakPos + 1);

    return precedingEmptySpaces.length + 1;
};

const getFirstEmptyCharPos = content => {
    const firstLineBreakPos  = content.indexOf(Constants.EOL);
    const firstBlankSpacePos = content.indexOf(' ');

    if (firstLineBreakPos === -1 && firstBlankSpacePos === -1) {
        return content.length;
    } else if (firstLineBreakPos >= 0 && firstBlankSpacePos === -1) {
        return firstLineBreakPos;
    } else if (firstLineBreakPos === -1 && firstBlankSpacePos >= 0) {
        return firstBlankSpacePos;
    } else if (firstLineBreakPos >= 0 && firstBlankSpacePos >= 0) {
        return Math.min(firstLineBreakPos, firstBlankSpacePos);
    }
};

module.exports.getElementList           = getElementList;
module.exports.checkBalance             = checkBalance;
module.exports.getLineBreakQty          = getLineBreakQty;
module.exports.getCharOccurrenceQty     = getCharOccurrenceQty;
module.exports.getNextNonEmptyCharPos   = getNextNonEmptyCharPos;
module.exports.getLeadingEmptyChars     = getLeadingEmptyChars;
module.exports.getLeadingLineBreakQty   = getLeadingLineBreakQty;
module.exports.getTrailingEmptyCharsQty = getTrailingEmptyCharsQty;
module.exports.getBlankSpaceString      = getBlankSpaceString;
module.exports.getColumnNumber          = getColumnNumber;
module.exports.getFirstEmptyCharPos     = getFirstEmptyCharPos;
