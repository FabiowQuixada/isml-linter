/**
 * The purpose of this function is to find the corresponding closing element of an HTML/ISML element,
 * which we will name 'E'. 'E' is the first element found in the 'content' string.


 * The function will return as soon as it finds the corresponding closing element, so the 'content' string does
 * not have to be a balanced HTML/ISML representation, since it will ignore everything after that.

 * The 'depth' variable works as a stack, taking into account only elements of type 'E'
*/
const getCorrespondentClosingElementPosition = content => {
    const openingElemRegex = /<[a-zA-Z]*(\s|>|\/)/;
    const closingElemRegex = /<\/.[a-zA-Z]*>/;

    let state = getInitialState(content);

    state = maskIgnorableContent(state);

    while (isClosingPositionNotFound(state)) {

        state = initializeLoopState(state, openingElemRegex, closingElemRegex);

        if (isNextElementATag(state)) {
            state = updateState(state);

            if (!state.elementStack.length) {
                return state.result;
            }
        } else {
            state = removeLeadingNonTagText(state);
        }
    }

    return -1;
};

const getInitialState = content => {
    return {
        content: content,
        openingElemPos: -1,
        closingElementPos: -1,
        result: -1,
        currentReadingPos: 0,
        elementStack: []
    };
};

const updateState = oldState => {
    let newState = Object.assign({}, oldState);

    newState.currentReadingPos += newState.firstClosingElemPos;
    newState = updateElementStack(newState);
    newState = removeFirstElement(newState);

    newState.result = newState.currentReadingPos - newState.firstClosingElemPos;

    return newState;
};

const isClosingPositionNotFound = state => {
    return state.content &&
           state.openingElemPos !== Number.POSITIVE_INFINITY &&
           state.closingElementPos !== Number.POSITIVE_INFINITY;
};

const removeLeadingNonTagText = oldState => {
    const newState = Object.assign({}, oldState);

    newState.content = oldState.content.substring(oldState.content.indexOf('<'), oldState.content.length);
    newState.currentReadingPos += oldState.content.indexOf('<');

    return newState;
};

const removeFirstElement = oldState => {
    const newState = Object.assign({}, oldState);

    newState.content = newState.content.substring(newState.firstClosingElemPos, newState.content.length);

    return newState;
};

const initializeLoopState = (oldState, openingElemRegex, closingElemRegex) => {

    const newState = Object.assign({}, oldState);

    openingElemRegex.lastIndex = 0;
    closingElemRegex.lastIndex = 0;

    newState.firstClosingElemPos = newState.content.indexOf('>')+1;
    newState.isSelfClosingElement = newState.content.charAt(newState.firstClosingElemPos-2) === '/';

    newState.openingElemPos = Number.POSITIVE_INFINITY;
    newState.closingElementPos = Number.POSITIVE_INFINITY;

    const openingElem = openingElemRegex.exec(newState.content);
    const closingElement = closingElemRegex.exec(newState.content);

    if (openingElem) {
        newState.openingElemPos = openingElem.index;
    }

    if (closingElement) {
        newState.closingElementPos = closingElement.index;
    }

    return newState;
};

const updateElementStack = oldState => {

    const newState = Object.assign({}, oldState);
    const elem = getFirstElementType(newState.content);

    if (!newState.isSelfClosingElement) {
        if (newState.openingElemPos < newState.closingElementPos) {
            newState.elementStack.push(elem);
        } else {
            newState.elementStack.pop();
        }
    }

    return newState;
};

/**
 * Replaces '${...}' with '______', so it facilites next processes. For Example,
 * if ${ 3 < 4 } is present, the '<' symbol might be thought as an opening tag
 * symbol. The same is valid for <isscript> and <iscomment> tags;
 */
const maskIgnorableContent = oldState => {

    const newState = Object.assign({}, oldState);
    let content = newState.content;

    content = replaceContentOfFirstWrappingTag(content, '${', '}');
    content = replaceContentOfFirstWrappingTag(content, '<isscript>', '</isscript>');
    content = replaceContentOfFirstWrappingTag(content, '<iscomment>', '</iscomment>');

    newState.content = content;

    return newState;
};

const replaceContentOfFirstWrappingTag = (content, startString, endString) => {

    const placeholderSymbol = '_';
    let result = content;

    const startStringPos = result.indexOf(startString);
    const endStringPos = result.indexOf(endString);

    if (startStringPos !== -1 && endStringPos !== -1) {
        const startStringEndPos = startStringPos + startString.length;
        const endStringStartPos = endStringPos-1;
        let placeholder = '';

        for (let i = startStringEndPos; i <= endStringStartPos; i++) {
            placeholder += placeholderSymbol;
        }

        result = result.substring(0, startStringEndPos) +
                 placeholder +
                 result.substring(endStringStartPos+1, result.length+1);
    }

    return result;
};

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

module.exports = {
    getCorrespondentClosingElementPosition
};
