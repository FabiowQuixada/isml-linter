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
const getCorrespondentClosingElementPosition = (content, parentState) => {
    const balanceCheckResult = isBalanced(content, parentState);

    if (balanceCheckResult.error) {
        throwInvalidCharacterException(balanceCheckResult.error);
    }

    const openingElemRegex = /<[a-zA-Z]*(\s|>|\/)/;
    const closingElemRegex = /<\/.[a-zA-Z]*>/;
    const internalState    = getInitialState(content, parentState);

    if (internalState.error) {
        internalState.error.templatePath = parentState.templatePath;
        throwInvalidCharacterException(internalState.error);
    }

    let previousContent = null;

    parentState.currentElement.endPosition = internalState.maskedContent.indexOf('>');

    while (internalState.maskedContent) {

        if (ParseUtils.isNextElementATag(internalState.maskedContent)) {
            const nextOpeningCharPosition       = internalState.maskedContent.indexOf('<');
            const pastContentLength             = internalState.initialMaskedContent.indexOf(internalState.maskedContent);
            const contentUpToCurrentPosition    = internalState.initialMaskedContent.substring(0, pastContentLength + nextOpeningCharPosition);
            const currentElemStartingLineNumber = ParseUtils.getLineBreakQty(contentUpToCurrentPosition) + parentState.currentLineNumber;

            initializeLoopState(internalState, openingElemRegex, closingElemRegex);
            updateState(internalState, currentElemStartingLineNumber, parentState);

            if (!internalState.elementStack.length) {
                parentState.currentElemClosingTagInitPos = contentUpToCurrentPosition.length;
                return parentState;
            }
        } else {
            removeLeadingNonTagText(internalState);
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
        parentState.templatePath);
};

const throwUnbalancedElementException = internalState => {
    const stackTopElement = internalState.elementStack.pop();
    const elemLength      = stackTopElement.value.trim().length;

    throw ExceptionUtils.unbalancedElementError(
        stackTopElement.elem,
        stackTopElement.lineNumber,
        stackTopElement.globalPos,
        elemLength,
        internalState.templatePath);
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
    const internalState = {
        parentState,
        content,
        currentElement    : {},
        currentLineNumber : parentState.currentLineNumber,
        openingElemPos    : -1,
        closingElementPos : -1,
        result            : -1,
        currentReadingPos : 0,
        elementStack      : []
    };

    const positionData = getPosition(internalState.content);

    if (positionData.error) {
        return positionData;
    }

    internalState.currentElement.endPosition = positionData.currentElemEndPosition;
    internalState.maskedContent              = positionData.content;
    internalState.initialMaskedContent       = positionData.content;
    internalState.initialContent             = content;

    return internalState;
};

const updateState = (internalState, currentElementStartingLineNumber, parentState) => {
    internalState.currentReadingPos += internalState.firstClosingElemPos;

    updateElementStack(internalState, currentElementStartingLineNumber, parentState);
    removeFirstElement(internalState);

    internalState.result = internalState.currentReadingPos - internalState.firstClosingElemPos;
};

const removeLeadingNonTagText = internalState => {
    let splitPosition   = internalState.maskedContent.indexOf('<');

    if (splitPosition === -1) {
        splitPosition = internalState.maskedContent.length;
    }

    const length                    = internalState.maskedContent.length;
    internalState.maskedContent     = internalState.maskedContent.substring(splitPosition, length);
    internalState.content           = internalState.content.substring(splitPosition, length);
    internalState.currentReadingPos += splitPosition;
};

const removeFirstElement = internalState => {
    const elemLength = internalState.maskedContent.length;

    internalState.maskedContent = internalState.maskedContent.substring(internalState.firstClosingElemPos, elemLength);
    internalState.content       = internalState.content.substring(internalState.firstClosingElemPos, elemLength);
};

const initializeLoopState = (internalState, openingElemRegex, closingElemRegex) => {
    openingElemRegex.lastIndex = 0;
    closingElemRegex.lastIndex = 0;
    const elementType          = ParseUtils.getFirstElementType(internalState.maskedContent);

    internalState.firstClosingElemPos  = internalState.maskedContent.indexOf('>') + 1;
    internalState.isSelfClosingElement =
        internalState.maskedContent.charAt(internalState.firstClosingElemPos - 2) === '/' &&
        elementType !== 'isif';

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
};

const updateElementStack = (internalState, currentElementStartingLineNumber, parentState) => {
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
            const currentElementContent = internalState.content.substring(0, prevElementPosition);

            parentState.closingElementsStack.push(currentElementContent);
            internalState.elementStack.pop();
        } else {
            throwUnbalancedElementException(internalState);
        }
    }
};

const getPosition = content => {

    content = MaskUtils.maskIgnorableContent(content);

    if (content.error) {
        return content;
    }

    const currentElemEndPosition = content.indexOf('<');

    return {
        currentElemEndPosition,
        content
    };
};

const isLetter = str => str.length === 1 && str.match(/[a-z]/i);

const isBalanced = (content, state) => {

    const templatePath       = state.templatePath;
    const startingLineNumber = state.currentLineNumber;
    let depth                = 0;

    for (let i = 0; i < content.length; i++) {
        const char = content[i];

        // TODO: Not good;
        const isNextCharALetter = i !== content.length - 1 && isLetter(content[i + 1]);

        if (char === '<' && isNextCharALetter && depth === 0) {
            depth++;
            const elem = ParseUtils.getNextElementValue(content.substring(i));

            if (elem.error) {
                throw ExceptionUtils.unclosedDeprecatedIsmlComment(
                    state.currentLineNumber + elem.error.localLineNumber,
                    state.currentElement.initPosition + elem.error.localPos,
                    elem.error.length,
                    state.templatePath
                );
            }
            const currentLocalLineNumber = ParseUtils.getLineBreakQty(content.substring(0, i));
            let maskedContent            = MaskUtils.maskInBetween(elem, 'iscomment');

            // TODO Wrap all of this into MaskUtils?
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
