const IsmlNode = require('./IsmlNode');
const ClosingTagFinder = require('./components/ClosingTagFinder');
const IsifTagParser = require('./components/IsifTagParser');
const MultiClauseNode = require('./MultiClauseNode');
const fs = require('fs');

const ISIF = '<isif';

const build = filePath => {

    const ParseStatus = require('../enums/ParseStatus');

    const rootNode = new IsmlNode();
    const result = {
        rootNode,
        status: ParseStatus.NO_ERRORS,
        message: ''
    };

    try {

        const fileContent = fs.readFileSync(filePath, 'utf-8');

        parse(rootNode, fileContent);
    } catch (e) {
        result.rootNode = null;
        result.status = ParseStatus.INVALID_DOM;
        result.message = e;
    }

    return result;
};

/**
 * TODO: Further refactoring needed;
 */
const parse = (parentNode, content, parentState) => {

    let state = getInitialState(content, parentState);

    for (let i = 0; i < content.length; i++) {
        setCurrentElementStartLineNumber(state, i);
        state = iterate(state, parentNode, i);
    }
};

const iterate = (state, parentNode, i) => {
    state = initializeLoopState(state, i);

    if (skipIteraction(state)) {
        return state;
    }

    state = processContent(state, parentNode);

    return state;
};

const getInitialState = (contentAsArray, parentState) => {

    const regex = /\n/gi;
    let result;
    let lineBreakPosition = 0;
    const state = {

        content: contentAsArray.replace(/(\r\n\t|\n|\r\t)/gm, ''),
        contentAsArray: contentAsArray,
        currentElement: {
            asString: '',
            initPosition: -1,
            endPosition: -1,
            startingLineNumber: -1
        },
        lineBreakPositionList: [0],
        currentLineNumber: 0,
        currentChar: null,
        currentPos: -1,
        ignoreUntil: null,
        insideTag: false,
        nonTagBuffer: '',
        insideExpression: false,
        depth: 0
    };

    if (parentState) {
        state.currentLineNumber = parentState.currentLineNumber;
    }

    while ( result = regex.exec(contentAsArray) ) {
        lineBreakPosition = result.index - state.lineBreakPositionList.length + 1;
        state.lineBreakPositionList.push(lineBreakPosition);
    }

    return state;

};

const initializeLoopState = (oldState, i) => {
    let newState = Object.assign({}, oldState);

    newState.currentChar = newState.content.charAt(i);
    newState.currentElement.asString += newState.currentChar;
    newState.currentPos = i;

    newState = updateStateWhetherItIsInsideExpression(newState);

    if (newState.ignoreUntil && newState.ignoreUntil < i && newState.ignoreUntil !== newState.content.length + 1) {
        newState.ignoreUntil = null;
    }

    return newState;
};

const skipIteraction = state => {
    return state.ignoreUntil && state.ignoreUntil >= state.currentPos ||
           state.insideTag && state.insideExpression;
};

const processContent = (oldState, parentNode) => {

    const newState = Object.assign({}, oldState);

    if (newState.currentChar === '<') {
        prepareStateForOpeningElement(newState, parentNode);
    } else if (newState.currentChar === '>') {
        createNodeForCurrentElement(newState, parentNode);
    } else if (!newState.insideTag) {
        newState.nonTagBuffer += newState.currentChar;
    }

    return newState;
};

const updateStateWhetherItIsInsideExpression = oldState => {
    const newState = Object.assign({}, oldState);

    if (newState.insideTag) {
        if (isOpeningIsmlExpression(newState)) {
            newState.insideExpression = true;
        } else if (isClosingIsmlExpression(newState)) {
            newState.insideExpression = false;
        }
    }

    return newState;
};

const createNode = (parentNode, state) => {

    let node = null;

    if (state.currentElement.asString.trim().startsWith(ISIF)) {
        node = new MultiClauseNode();
    } else {
        node = new IsmlNode(state.currentElement.asString, state.currentElement.startingLineNumber);
    }

    parentNode.addChild(node);

    if (!node.isSelfClosing()) {
        return handleInnerContent(node, state);
    }

    return null;
};

const handleInnerContent = (node, state) => {

    const currentPos = state.currentPos;
    const nodeInnerContent = getInnerContent(state);

    if (isNextElementATag(state)) {
        if (state.content.trim().startsWith(ISIF)) {
            IsifTagParser.run(node, nodeInnerContent, state.currentElement.asString);
        } else {
            parse(node, nodeInnerContent.trim(), state);
        }
    } else {
        addTextToNode(node, nodeInnerContent.trim(), state);
    }

    return currentPos + nodeInnerContent.length;
};

const addTextToNode = (node, nodeInnerContent, state) => {
    const innerTextNode = new IsmlNode(nodeInnerContent, state.currentLineNumber);
    node.addChild(innerTextNode);
};

const getInnerContent = oldState => {
    let newState = Object.assign({}, oldState);
    const content = getUpdateContent(newState);
    newState = ClosingTagFinder.getCorrespondentClosingElementPosition(content, newState);

    return pickInnerContent(newState, content);
};

const getUpdateContent = state => {
    let content = state.content;
    const currentElementInitPosition = state.currentElement.initPosition;
    content = content.substring(currentElementInitPosition, content.length);
    return content;
};

const pickInnerContent = (state, content) => {

    const innerContentStartPos = state.currentElement.endPosition+1;
    const innerContentEndPos = state.currentElemClosingTagInitPos;
    return content.substring(innerContentStartPos, innerContentEndPos);
};

const getNextNonEmptyChar = state => {

    const content = state.content;
    const currentPos = state.currentPos;

    return content.substring(currentPos+1, content.length-1).trim()[0];
};

/**
 * TODO: Use regex;
 */
const isOpeningIsmlExpression = state => {

    const content = state.content;
    const currentPos = state.currentPos;

    const currChar = content.charAt(currentPos);
    const nextChar = content.charAt(currentPos+1);

    return currChar === '$' && nextChar === '{';
};

const isClosingIsmlExpression = state => {

    const content = state.content;
    const currentPos = state.currentPos;
    const insideExpression = state.insideExpression;

    return insideExpression && content.charAt(currentPos-1) === '}';
};

/**
 * TODO: Use regex;
 */
const isOpeningElem = state => {

    const content = state.content;
    const currPos = state.currentElement.initPosition;

    const currenChar = content.charAt(currPos);
    const nextChar = content.charAt(currPos+1);

    return currenChar === '<' && nextChar !== '/';
};

const isNextElementATag = state => getNextNonEmptyChar(state) === '<';

const reinitializeState = newState => {
    newState.insideTag = false;
    newState.currentElement.asString = '';
    newState.currentElement.initPosition = -1;
    newState.currentElement.endPosition = -1;
};

const createNodeForCurrentElement = (newState, parentNode) => {

    newState.depth -= 1;

    if (newState.depth === 0) {
        if (isOpeningElem(newState)) {
            newState.ignoreUntil = createNode(parentNode, newState);
        }

        reinitializeState(newState);
    }
};

const prepareStateForOpeningElement = (newState, parentNode) => {

    if (newState.nonTagBuffer && newState.nonTagBuffer.replace(/\s/g, '').length) {
        const node = new IsmlNode(newState.nonTagBuffer);
        parentNode.addChild(node);
        reinitializeState(newState);
        newState.ignoreUntil += newState.nonTagBuffer.length - 1;
        newState.currentElement.asString = '<';
    }

    if (newState.depth === 0) {
        newState.currentElement.initPosition = newState.currentPos;
    }

    newState.insideTag = true;
    newState.depth += 1;
};

const isEmptyLineDetected = (state, index) => state.lineBreakPositionList[index] === state.lineBreakPositionList[index + 1];

const setCurrentElementStartLineNumber = (state, i) => {

    const index = state.lineBreakPositionList.indexOf(i);

    if (index !== -1) {
        state.currentLineNumber += 1;
    }

    getNextNonEmptyLine(index, state);

    if (!state.insideTag) {
        state.currentElement.startingLineNumber = state.currentLineNumber;
    }
};

const getNextNonEmptyLine = (index, state) => {

    while (isEmptyLineDetected(state, index)) {
        state.currentLineNumber += 1;
        index += 1;
    }
};

module.exports.build = build;
module.exports.parse = parse;
