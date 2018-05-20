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

    let state = {
        content: content,
        openingElemPos: -1,
        closingElementPos: -1,
        result: -1,
        currentReadingPos: 0,
        elementStack: []
    };

    state = replaceIsmlExpressionWithPlaceholder(state);

    while (isClosingPositionNotFound(state)) {

        state = initializeLoopVariables(state, openingElemRegex, closingElemRegex);

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

const initializeLoopVariables = (oldState, openingElemRegex, closingElemRegex) => {

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
 * Replaces '${...}' with '======', so it facilites next processes. For Example,
 * if ${ 3 < 4 } is present, the '<' symbol might be thought as an opening tag
 * symbol. The same is valid for <isscript> and <iscomment> tags;
 */
const replaceIsmlExpressionWithPlaceholder = oldState => {

    const newState = Object.assign({}, oldState);

    newState.content = replaceContent(newState.content, '${', '}');

    return newState;
};

const replaceContent = (content, init, end) => {

    const placeholderSymbol = '_';
    let result = content;

    while (result.indexOf(init) !== -1) {
        const a = result.indexOf(init);
        const b = result.indexOf(end);
        let placeholder = '';

        for (let i = a; i <= b; i++) { placeholder += placeholderSymbol; }

        result = result.substring(0, a) +
                 placeholder +
                 result.substring(b+1, result.length+1);
    }

    return result;
};

const isNextElementATag = parseState => getNextNonEmptyChar(parseState) === '<';

const getNextNonEmptyChar = parseState => {

    const content = parseState.content;
    const currentPos = parseState.currentPos;

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
