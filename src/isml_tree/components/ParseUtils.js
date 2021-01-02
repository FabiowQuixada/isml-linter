
/**
 * The functions defined in this file do not create or modify a state, they
 * simply analyze it and return relevant information;
 */

const Constants      = require('../../Constants');
const ExceptionUtils = require('../../util/ExceptionUtils');
const SfccTags       = require('../../enums/SfccTags');
const GeneralUtils   = require('../../util/GeneralUtils');
const MaskUtils      = require('../MaskUtils');

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
        node.parent && !node.parent.isMulticlause() &&
        (node.isHtmlTag() || node.isIsmlTag()) &&
        !node.isSelfClosing() && !node.suffixValue
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
    const ConfigUtils = require('../../util/ConfigUtils');

    const config               = ConfigUtils.load();
    const isTag                = trimmedElement.startsWith('<') && !trimmedElement.startsWith('<!--');
    const elementType          = getElementType(trimmedElement);
    const isDocType            = trimmedElement.startsWith('<!doctype ');
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


const getElementList = (templateContent, templatePath) => {

    const originalContent       = GeneralUtils.toLF(templateContent);
    const originalShadowContent = MaskUtils.maskIgnorableContent(originalContent, null, templatePath);
    const elementList           = [];
    let remainingContent        = originalContent;
    let remainingShadowContent  = originalShadowContent;
    let pastContent             = '';

    do {
        const nextOpeningTagOrExpressionInitPos = Math.min(...[
            remainingShadowContent.indexOf('<'),
            remainingShadowContent.indexOf('<--'),
            remainingShadowContent.indexOf('${')
        ].filter(j => j !== -1)) + 1;

        let nextClosingTagOrExpressionEndPos = Math.min(...[
            remainingShadowContent.indexOf('>'),
            remainingShadowContent.indexOf('-->'),
            remainingShadowContent.indexOf('}')
        ].filter(j => j !== -1)) + 1;

        let elementValue = remainingContent.substring(0, nextClosingTagOrExpressionEndPos);
        let elementType;
        let elementGlobalPos;
        let elementLineNumber;
        let isElementSelfClosing;
        let isClosingTag;
        let tagType;
        let cutSpot      = null;

        // If there is any leading hard coded text;
        if (remainingShadowContent.substring(0, nextOpeningTagOrExpressionInitPos - 1).trim().length > 0) {
            cutSpot = remainingShadowContent.substring(0, nextOpeningTagOrExpressionInitPos - 1).length;

            nextClosingTagOrExpressionEndPos = nextOpeningTagOrExpressionInitPos;
            elementValue                     = remainingContent.substring(0, cutSpot);

            remainingShadowContent = remainingShadowContent.substring(cutSpot);
            remainingContent       = remainingContent.substring(cutSpot);
            pastContent            = originalContent.substring(0, pastContent.length + cutSpot);
        }

        // If there is no element left (only blank spaces and / or line breaks);
        if (!isFinite(nextClosingTagOrExpressionEndPos)) {
            nextClosingTagOrExpressionEndPos = remainingShadowContent.length - 1;
        }

        const trimmedElement = elementValue.trim();

        if (trimmedElement.startsWith('<') || trimmedElement.startsWith('${')) {
            const isTag               = trimmedElement.startsWith('<') && !trimmedElement.startsWith('<!--');
            const isExpression        = trimmedElement.startsWith('${');
            const isHtmlOrIsmlComment = trimmedElement.startsWith('<!--');

            elementValue = remainingContent.substring(0, nextClosingTagOrExpressionEndPos);

            // html comment, isml comment?
            elementType = isTag ? trimmedElement.startsWith('<is') || trimmedElement.startsWith('</is') ? 'ismlTag' : 'htmlTag' :
                isHtmlOrIsmlComment ? 'htmlOrIsmlComment' :
                    isExpression ? 'expression' :
                        'text';

            if (isTag) {
                tagType = getElementType(trimmedElement);
            }

            isElementSelfClosing = isSelfClosing(trimmedElement);

            isClosingTag      = isTag && trimmedElement.startsWith('</');
            elementLineNumber = getLineBreakQty(pastContent) + getLeadingLineBreakQty(elementValue) + 1;
            elementGlobalPos  = pastContent.length + getLeadingEmptyChars(elementValue).length;
        } else {
            elementType          = 'text';
            elementLineNumber    = getLineBreakQty(pastContent.substring(0, pastContent.length - cutSpot))
                + getLeadingLineBreakQty(elementValue) + 1;
            elementGlobalPos     = pastContent.length - cutSpot + getLeadingEmptyChars(elementValue).length;
            isElementSelfClosing = true;
        }

        if (global.isWindows) {
            elementGlobalPos += elementLineNumber - 1;
        }

        elementList.push({
            value         : elementValue,
            type          : elementType,
            globalPos     : elementGlobalPos,
            lineNumber    : elementLineNumber,
            isSelfClosing : isElementSelfClosing,
            isClosingTag  : isClosingTag,
            tagType       : tagType
        });

        if (!cutSpot) {
            remainingShadowContent = remainingShadowContent.substring(elementValue.length);
            remainingContent       = remainingContent.substring(elementValue.length);
            pastContent            = originalContent.substring(0, pastContent.length + elementValue.length);
        }
    } while (remainingShadowContent.length > 0);

    const lastElement       = elementList[elementList.length - 1];
    const secondLastElement = elementList[elementList.length - 2];

    if (lastElement.value.trim().length === 0) {
        secondLastElement.value += lastElement.value;
        elementList.pop();
    }

    return elementList;
};

module.exports.getElementList         = getElementList;
module.exports.checkBalance           = checkBalance;
module.exports.getLineBreakQty        = getLineBreakQty;
module.exports.getCharOccurrenceQty   = getCharOccurrenceQty;
module.exports.getNextNonEmptyCharPos = getNextNonEmptyCharPos;
module.exports.getLeadingEmptyChars   = getLeadingEmptyChars;
module.exports.getLeadingLineBreakQty = getLeadingLineBreakQty;
