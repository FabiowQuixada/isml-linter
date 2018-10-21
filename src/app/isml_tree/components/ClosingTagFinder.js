const ErrorType = require('./../../ErrorType');
const MaskUtils = require('../MaskUtils');

/**
 * The purpose of this function is to find the corresponding closing element of an HTML/ISML element,
 * which we will name 'E'. 'E' is the first element found in the 'content' string.


 * The function will return as soon as it finds the corresponding closing element, so the 'content' string does
 * not have to be a balanced HTML/ISML representation, since it will ignore everything after that.

 * The 'depth' variable works as a stack, taking into account only elements of type 'E'
*/
const getCorrespondentClosingElementPosition = (content, oldGlobalState) => {
    const newGlobalState = Object.assign({}, oldGlobalState);
    const openingElemRegex = /<[a-zA-Z]*(\s|>|\/)/;
    const closingElemRegex = /<\/.[a-zA-Z]*>/;

    let internalState = getInitialState(content, newGlobalState);
    const obj = getPosition(internalState.content);

    internalState.currentElement.endPosition = obj.currentElemEndPosition;
    internalState.content = obj.content;
    const maskedContent = obj.content;

    newGlobalState.currentElement.endPosition = maskedContent.indexOf('>');

    while (internalState.content) {

        if (isNextElementATag(internalState)) {

            internalState = initializeLoopState(internalState, openingElemRegex, closingElemRegex);
            internalState = updateState(internalState);

            if (!internalState.elementStack.length) {
                newGlobalState.currentElemClosingTagInitPos = internalState.result;
                return newGlobalState;
            }
        } else {
            internalState = removeLeadingNonTagText(internalState);
        }
    }

    throw ErrorType.INVALID_DOM;
};

const getInitialState = (content, globalState) => {
    return {
        globalState: globalState,
        currentElement: {},
        content: content,
        openingElemPos: -1,
        closingElementPos: -1,
        result: -1,
        currentReadingPos: 0,
        elementStack: []
    };
};

const updateState = oldState => {
    let state = Object.assign({}, oldState);

    state.currentReadingPos += state.firstClosingElemPos;
    state = updateElementStack(state);
    state = removeFirstElement(state);

    state.result = state.currentReadingPos - state.firstClosingElemPos;

    return state;
};

const removeLeadingNonTagText = oldState => {
    const state = Object.assign({}, oldState);

    state.content = oldState.content.substring(oldState.content.indexOf('<'), oldState.content.length);
    state.currentReadingPos += oldState.content.indexOf('<');

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

    state.firstClosingElemPos = state.content.indexOf('>')+1;
    state.isSelfClosingElement = state.content.charAt(state.firstClosingElemPos-2) === '/';

    state.openingElemPos = Number.POSITIVE_INFINITY;
    state.closingElementPos = Number.POSITIVE_INFINITY;

    const openingElem = openingElemRegex.exec(state.content);
    const closingElement = closingElemRegex.exec(state.content);

    if (openingElem) {
        state.openingElemPos = openingElem.index;
    }

    if (closingElement) {
        state.closingElementPos = closingElement.index;
    }

    return state;
};

const updateElementStack = oldState => {

    const state = Object.assign({}, oldState);
    const elem = getFirstElementType(state.content);

    if (!state.isSelfClosingElement) {
        if (!elem.startsWith('/')) {
            if(elem !== 'iselse' && elem !== 'iselseif') {
                state.elementStack.push(elem);
            }
        } else if (isCorrespondentElement(state, elem)) {
            state.elementStack.pop();
        } else {
            throw `${ErrorType.INVALID_DOM} :: Unbalanced <${elem.substring(1)}> element`;
        }
    }

    return state;
};

const isCorrespondentElement = (state, elem) =>
    `/${state.elementStack[state.elementStack.length-1]}` === elem;

const isNextElementATag = state => getNextNonEmptyChar(state) === '<';

const getNextNonEmptyChar = state => {

    const content = state.content;
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

    content = MaskUtils.maskIgnorableContent(content);
    const currentElemEndPosition = content.indexOf('<');

    return {
        currentElemEndPosition,
        content
    };
};

module.exports = {
    getCorrespondentClosingElementPosition
};
