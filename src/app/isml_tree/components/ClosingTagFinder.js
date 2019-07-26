const MaskUtils      = require('../MaskUtils');
const ParseUtils     = require('./ParseUtils');
const ExceptionUtils = require('../../util/ExceptionUtils');
const Constants      = require('../../Constants');
const ConfigUtils    = require('../../util/ConfigUtils');

/**
 * The purpose of this function is to find the corresponding closing element of an HTML/ISML element,
 * which we will name 'E'. 'E' is the first element found in the 'content' string.


 * The function will return as soon as it finds the corresponding closing element, so the 'content' string does
 * not have to be a balanced HTML/ISML representation, since it will ignore everything after that.

 * The 'depth' variable works as a stack, taking into account only elements of type 'E'
*/
const getCorrespondentClosingElementPosition = (content, oldParentState) => {
    const balanceCheckResult = isBalanced(content, oldParentState);

    if (balanceCheckResult.error) {
        throwInvalidCharacterException(balanceCheckResult.error);
    }

    const parentState      = Object.assign({}, oldParentState);
    const openingElemRegex = /<[a-zA-Z]*(\s|>|\/)/;
    const closingElemRegex = /<\/.[a-zA-Z]*>/;

    let internalState = getInitialState(content, parentState);
    const obj         = getPosition(internalState.content);

    internalState.currentElement.endPosition = obj.currentElemEndPosition;
    internalState.maskedContent              = obj.content;
    internalState.initialMaskedContent       = obj.content;
    internalState.initialContent             = content;
    let previousContent                      = null;

    parentState.currentElement.endPosition = internalState.maskedContent.indexOf('>');

    while (internalState.maskedContent) {

        if (ParseUtils.isNextElementATag(internalState.maskedContent)) {
            const nextOpeningCharPosition       = internalState.maskedContent.indexOf('<');
            const pastContentLength             = internalState.initialMaskedContent.indexOf(internalState.maskedContent);
            const contentUpToCurrentPosition    = internalState.initialMaskedContent.substring(0, pastContentLength + nextOpeningCharPosition);
            const currentElemStartingLineNumber = (contentUpToCurrentPosition.match(new RegExp(Constants.EOL, 'g')) || []).length + parentState.currentLineNumber;

            internalState = initializeLoopState(internalState, openingElemRegex, closingElemRegex);
            internalState = updateState(internalState, currentElemStartingLineNumber, parentState);

            if (!internalState.elementStack.length) {
                parentState.currentElemClosingTagInitPos = contentUpToCurrentPosition.length;
                return parentState;
            }
        } else {
            internalState = removeLeadingNonTagText(internalState);
        }

        if (previousContent === internalState.maskedContent) {
            throwParseException(previousContent, parentState);
        }

        previousContent = internalState.maskedContent;
    }

    throwUnbalancedElementException(internalState);
};

const throwParseException = (previousContent, parentState) => {
    const elementType = ParseUtils.getFirstElementType(previousContent.trim());
    const lineNumber  = parentState.currentLineNumber + ParseUtils.getPrecedingEmptyLinesQty(previousContent);
    const length      = elementType.length;
    const globalPos   = parentState.currentPos + ParseUtils.getNextNonEmptyCharPos(previousContent);

    throw ExceptionUtils.parseError(
        elementType,
        lineNumber,
        globalPos,
        length,
        parentState.filePath);
};

const throwUnbalancedElementException = internalState => {
    const stackTopElement = internalState.elementStack.pop();
    const elemLength      = stackTopElement.value.trim().length;

    throw ExceptionUtils.unbalancedElementError(
        stackTopElement.elem,
        stackTopElement.lineNumber,
        stackTopElement.globalPos,
        elemLength,
        internalState.filePath);
};

const throwInvalidCharacterException = error => {
    throw ExceptionUtils.invalidCharacterError(
        error.character,
        error.lineNumber,
        error.globalPos,
        error.elemLength,
        error.templatePath);
};

const getInitialState = (content, parentState) => {
    return {
        parentState       : parentState,
        currentElement    : {},
        currentLineNumber : parentState.currentLineNumber,
        content           : content,
        openingElemPos    : -1,
        closingElementPos : -1,
        result            : -1,
        currentReadingPos : 0,
        elementStack      : []
    };
};

const updateState = (oldInternalState, currentElementStartingLineNumber, parentState) => {
    let internalState = Object.assign({}, oldInternalState);

    internalState.currentReadingPos += internalState.firstClosingElemPos;
    internalState                   = updateElementStack(internalState, currentElementStartingLineNumber, parentState);
    internalState                   = removeFirstElement(internalState);

    internalState.result = internalState.currentReadingPos - internalState.firstClosingElemPos;

    return internalState;
};

const removeLeadingNonTagText = oldInternalState => {
    const internalState = Object.assign({}, oldInternalState);
    let splitPosition   = oldInternalState.maskedContent.indexOf('<');

    if (splitPosition === -1) {
        splitPosition = oldInternalState.maskedContent.length;
    }

    internalState.maskedContent     = oldInternalState.maskedContent.substring(splitPosition, oldInternalState.maskedContent.length);
    internalState.content           = oldInternalState.content.substring(splitPosition, oldInternalState.maskedContent.length);
    internalState.currentReadingPos += splitPosition;

    return internalState;
};

const removeFirstElement = oldInternalState => {
    const internalState = Object.assign({}, oldInternalState);
    const elemLength    = internalState.maskedContent.length;

    internalState.maskedContent = internalState.maskedContent.substring(internalState.firstClosingElemPos, elemLength);
    internalState.content       = internalState.content.substring(internalState.firstClosingElemPos, elemLength);

    return internalState;
};

const initializeLoopState = (oldInternalState, openingElemRegex, closingElemRegex) => {

    const internalState = Object.assign({}, oldInternalState);

    openingElemRegex.lastIndex = 0;
    closingElemRegex.lastIndex = 0;

    internalState.firstClosingElemPos  = internalState.maskedContent.indexOf('>') + 1;
    internalState.isSelfClosingElement =
        internalState.maskedContent.charAt(internalState.firstClosingElemPos - 2) === '/' &&
        !internalState.maskedContent.startsWith('<isif');

    internalState.openingElemPos    = Number.POSITIVE_INFINITY;
    internalState.closingElementPos = Number.POSITIVE_INFINITY;

    const openingElem    = openingElemRegex.exec(internalState.maskedContent);
    const closingElement = closingElemRegex.exec(internalState.maskedContent);

    if (openingElem) {
        internalState.openingElemPos = openingElem.index;
    }

    if (closingElement) {
        internalState.closingElementPos = closingElement.index;
    }

    return internalState;
};

const updateElementStack = (oldInternalState, currentElementStartingLineNumber, parentState) => {

    const internalState = Object.assign({}, oldInternalState);
    const elemType      = ParseUtils.getFirstElementType(internalState.maskedContent).trim();
    const elemValue     = ParseUtils.getNextElementValue(internalState.content);
    const elemGlobalPos = internalState.currentReadingPos - elemValue.trim().length + internalState.parentState.currentElement.initPosition;
    const config        = ConfigUtils.load();
    const isVoidElement = !config.disableHtml5 && Constants.voidElementsArray.indexOf(elemType) !== -1;

    if (!internalState.isSelfClosingElement && !isVoidElement) {
        if (!elemType.startsWith('/')) {
            if (ParseUtils.isStackable(elemType)) {
                internalState.elementStack.push({
                    elem       : elemType,
                    value      : elemValue,
                    length     : elemValue.trim().length,
                    globalPos  : elemGlobalPos,
                    lineNumber : currentElementStartingLineNumber
                });
            }
        } else if (ParseUtils.isCorrespondentElement(internalState, elemType)) {
            const prevElementPosition   = internalState.maskedContent.indexOf('>') + 1;
            const currentElementContent = internalState.maskedContent.substring(0, prevElementPosition);

            parentState.closingElementsStack.push(currentElementContent);
            internalState.elementStack.pop();
        } else {
            throwUnbalancedElementException(internalState);
        }
    }

    return internalState;
};

const getPosition = content => {

    content                      = MaskUtils.maskIgnorableContent(content);
    const currentElemEndPosition = content.indexOf('<');

    return {
        currentElemEndPosition,
        content
    };
};

const isLetter = str => str.length === 1 && str.match(/[a-z]/i);

const isBalanced = (content, state) => {

    const templatePath       = state.filePath;
    const startingLineNumber = state.currentLineNumber;
    let depth                = 0;

    for (let i = 0; i < content.length; i++) {
        const char = content[i];

        // TODO: Not good;
        const isNextCharALetter = i !== content.length - 1 && isLetter(content[i + 1]);

        if (char === '<' && isNextCharALetter && depth === 0) {
            depth++;
            const elem                   = ParseUtils.getNextElementValue(content.substring(i));
            const currentLocalLineNumber = (content.substring(0, i).match(new RegExp(Constants.EOL, 'g')) || []).length;
            let maskedContent            = MaskUtils.maskInBetween(elem, 'iscomment');

            maskedContent = MaskUtils.maskInBetween(maskedContent, '${', '}');
            maskedContent = MaskUtils.maskInBetween(maskedContent, 'isscript');
            maskedContent = MaskUtils.maskInBetweenForTagWithAttributes(maskedContent, 'script');
            maskedContent = MaskUtils.maskInBetweenForTagWithAttributes(maskedContent, 'style');
            maskedContent = MaskUtils.maskInBetween(maskedContent, '<!---', '--->', true);
            maskedContent = MaskUtils.maskInBetween(maskedContent, '<!--', '-->', true);

            const localPos     = maskedContent.substring(1).indexOf('<');
            const isCondition  = localPos !== -1;
            const innerElement = content.substring(i + localPos + 1);

            if (isCondition && !innerElement.startsWith('<is')) {
                return {
                    error: {
                        character  : char,
                        elem       : elem,
                        lineNumber : startingLineNumber + currentLocalLineNumber + 1,
                        globalPos  : i + localPos + 1,
                        elemLength : 1,
                        templatePath
                    }
                };
            }
        } else if (char === '>') {
            depth--;
        }
    }

    return {};
};

module.exports = {
    getCorrespondentClosingElementPosition
};
