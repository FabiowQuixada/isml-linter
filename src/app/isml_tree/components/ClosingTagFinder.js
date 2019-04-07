const MaskUtils      = require('../MaskUtils');
const ParseUtils     = require('./ParseUtils');
const ExceptionUtils = require('../../ExceptionUtils');

/**
 * The purpose of this function is to find the corresponding closing element of an HTML/ISML element,
 * which we will name 'E'. 'E' is the first element found in the 'content' string.


 * The function will return as soon as it finds the corresponding closing element, so the 'content' string does
 * not have to be a balanced HTML/ISML representation, since it will ignore everything after that.

 * The 'depth' variable works as a stack, taking into account only elements of type 'E'
*/
const getCorrespondentClosingElementPosition = (content, oldParentState) => {
    const parentState      = Object.assign({}, oldParentState);
    const openingElemRegex = /<[a-zA-Z]*(\s|>|\/)/;
    const closingElemRegex = /<\/.[a-zA-Z]*>/;
    const currentElement   = {
        type       : ParseUtils.getFirstElementType(content),
        lineNumber : parentState.currentLineNumber
    };

    let internalState = getInitialState(content, parentState);
    const obj         = getPosition(internalState.content);

    internalState.currentElement.endPosition = obj.currentElemEndPosition;
    internalState.content                    = obj.content;
    internalState.initialContent             = obj.content;
    const maskedContent                      = obj.content;
    let previousContent                      = null;

    parentState.currentElement.endPosition = maskedContent.indexOf('>');

    while (internalState.content) {

        if (isNextElementATag(internalState)) {
            const nextOpeningCharPosition       = internalState.content.indexOf('<');
            const pastContentLength             = internalState.initialContent.indexOf(internalState.content);
            const contentUpToCurrentPosition    = internalState.initialContent.substring(0, pastContentLength + nextOpeningCharPosition);
            const currentElemStartingLineNumber = (contentUpToCurrentPosition.match(/\n/g) || []).length + parentState.currentLineNumber;

            internalState = initializeLoopState(internalState, openingElemRegex, closingElemRegex);
            internalState = updateState(internalState, currentElemStartingLineNumber, parentState);

            if (!internalState.elementStack.length) {
                parentState.currentElemClosingTagInitPos = internalState.result;
                return parentState;
            }
        } else {
            internalState = removeLeadingNonTagText(internalState);
        }

        if (previousContent === internalState.content) {
            throw ExceptionUtils.parseError(oldParentState.filePath);
        }

        previousContent = internalState.content;
    }

    throw ExceptionUtils.unbalancedElementError(currentElement.type, currentElement.lineNumber, oldParentState.filePath);
};

const getInitialState = (content, parentState) => {
    return {
        parentState: parentState,
        currentElement: {},
        currentLineNumber: parentState.currentLineNumber,
        content: content,
        openingElemPos: -1,
        closingElementPos: -1,
        result: -1,
        currentReadingPos: 0,
        elementStack: []
    };
};

const updateState = (oldState, currentElementStartingLineNumber, parentState) => {
    let state = Object.assign({}, oldState);

    state.currentReadingPos += state.firstClosingElemPos;
    state                   = updateElementStack(state, currentElementStartingLineNumber, parentState);
    state                   = removeFirstElement(state);

    state.result = state.currentReadingPos - state.firstClosingElemPos;

    return state;
};

const removeLeadingNonTagText = oldState => {
    const state       = Object.assign({}, oldState);
    let splitPosition = oldState.content.indexOf('<');

    if (splitPosition === -1) {
        splitPosition = oldState.content.length;
    }

    state.content           = oldState.content.substring(splitPosition, oldState.content.length);
    state.currentReadingPos += splitPosition;

    return state;
};

const removeFirstElement = oldState => {
    const state = Object.assign({}, oldState);

    state.content = state.content.substring(state.firstClosingElemPos, state.content.length);

    return state;
};

const initializeLoopState = (oldState, openingElemRegex, closingElemRegex) => {

    const state = Object.assign({}, oldState);

    openingElemRegex.lastIndex = 0;
    closingElemRegex.lastIndex = 0;

    state.firstClosingElemPos  = state.content.indexOf('>')+1;
    state.isSelfClosingElement =
        state.content.charAt(state.firstClosingElemPos - 2) === '/' &&
        !state.content.startsWith('<isif');

    state.openingElemPos    = Number.POSITIVE_INFINITY;
    state.closingElementPos = Number.POSITIVE_INFINITY;

    const openingElem    = openingElemRegex.exec(state.content);
    const closingElement = closingElemRegex.exec(state.content);

    if (openingElem) {
        state.openingElemPos = openingElem.index;
    }

    if (closingElement) {
        state.closingElementPos = closingElement.index;
    }

    return state;
};

const updateElementStack = (oldState, currentElementStartingLineNumber, parentState) => {

    const state = Object.assign({}, oldState);
    const elem  = getFirstElementType(state.content);

    if (!state.isSelfClosingElement) {
        if (!elem.startsWith('/')) {
            if(ParseUtils.isStackable(elem)) {
                state.elementStack.push({
                    elem,
                    lineNumber: currentElementStartingLineNumber
                });
            }
        } else if (isCorrespondentElement(state, elem)) {
            const prevElementPosition = state.content.indexOf('>') + 1;
            let currentElementContent = state.content.substring(0, prevElementPosition);
            const remainingContent    = state.content.substring(prevElementPosition, state.content.length);

            if (remainingContent.indexOf('>') === -1) {
                currentElementContent += remainingContent;
            }

            parentState.closingElementsStack.push(currentElementContent);
            state.elementStack.pop();
        } else {
            const stackTopElement = state.elementStack.pop();
            throw ExceptionUtils.unbalancedElementError(stackTopElement.elem, stackTopElement.lineNumber, state.filePath);
        }
    }

    return state;
};

const isCorrespondentElement = (state, elem) =>
    `/${state.elementStack[state.elementStack.length-1].elem}` === elem;

const isNextElementATag = state => getNextNonEmptyChar(state) === '<';

const getNextNonEmptyChar = state => {

    const content    = state.content;
    const currentPos = state.currentPos;

    return content.substring(currentPos+1, content.length-1).trim()[0];
};

const getFirstElementType = elementAsString => {
    let result = elementAsString.substring(elementAsString.indexOf('<') + 1, elementAsString.indexOf('>'));

    // In case the tag has attributes;
    if (result.indexOf(' ') !== -1) {
        result = result.split(' ')[0];
    }

    return result;
};

const getPosition = content => {

    content                      = MaskUtils.maskIgnorableContent(content);
    const currentElemEndPosition = content.indexOf('<');

    return {
        currentElemEndPosition,
        content
    };
};

module.exports = {
    getCorrespondentClosingElementPosition
};
