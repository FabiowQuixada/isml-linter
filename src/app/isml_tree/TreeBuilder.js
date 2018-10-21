const IsmlNode = require('./IsmlNode');
const ClosingTagFinder = require('./components/ClosingTagFinder');
const IsifTagParser = require('./components/IsifTagParser');
const MultiClauseNode = require('./MultiClauseNode');
const fs = require('fs');

const ISIF = '<isif';

const build = filePath => {

    const ParseStatus = require('../enums/ParseStatus');

    const result = {
        status: ParseStatus.NO_ERRORS,
        message: ''
    };

    try {

        const fileContent = fs.readFileSync(filePath, 'utf-8');

        result.rootNode = parse(fileContent);
    } catch (e) {
        result.rootNode = null;
        result.status = ParseStatus.INVALID_DOM;
        result.message = e;
    }

    return result;
};

const parse = (content, parentState, parentNode = new IsmlNode()) => {

    let state = getInitialState(content, parentState, parentNode);

    for (let i = 0; i < content.length; i++) {
        setCurrentElementStartLineNumber(state, i);
        state = iterate(state);
    }

    return state.parentNode;
};

const iterate = state => {
    state = initializeLoopState(state);

    if (skipIteraction(state)) {
        return state;
    }

    state = processContent(state);

    return state;
};

const getInitialState = (contentAsArray, parentState, parentNode) => {

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
        depth: 0,
        parentNode
    };

    if (parentState) {
        state.currentLineNumber = parentState.currentLineNumber;
        state.node = parentState.parentNode.newestChildNode;
    }

    while ( result = regex.exec(contentAsArray) ) {
        lineBreakPosition = result.index - state.lineBreakPositionList.length + 1;
        state.lineBreakPositionList.push(lineBreakPosition);
    }

    return state;

};

const initializeLoopState = oldState => {
    let state = Object.assign({}, oldState);

    state.currentChar = state.content.charAt(state.currentPos);
    state.currentElement.asString += state.currentChar;

    state = updateStateWhetherItIsInsideExpression(state);

    if (state.ignoreUntil && state.ignoreUntil < state.currentPos && state.ignoreUntil !== state.content.length + 1) {
        state.ignoreUntil = null;
    }

    return state;
};

const skipIteraction = state => {
    return state.ignoreUntil && state.ignoreUntil >= state.currentPos ||
           state.insideTag && state.insideExpression;
};

const processContent = oldState => {

    const state = Object.assign({}, oldState);

    if (state.currentChar === '<') {
        prepareStateForOpeningElement(state);
    } else if (state.currentChar === '>') {
        createNodeForCurrentElement(state);
    } else if (!state.insideTag) {
        state.nonTagBuffer += state.currentChar;
    }

    return state;
};

const updateStateWhetherItIsInsideExpression = oldState => {
    const state = Object.assign({}, oldState);

    if (state.insideTag) {
        if (isOpeningIsmlExpression(state)) {
            state.insideExpression = true;
        } else if (isClosingIsmlExpression(state)) {
            state.insideExpression = false;
        }
    }

    return state;
};

const createNode = state => {

    const isIsifNode = state.currentElement.asString.trim().startsWith(ISIF);
    const node = isIsifNode ?
        new MultiClauseNode() :
        new IsmlNode(state.currentElement.asString, state.currentElement.startingLineNumber);

    state.parentNode.addChild(node);

    if (!node.isSelfClosing()) {
        return processNewNodeInnerContent(state);
    }

    return null;
};

const processNewNodeInnerContent = state => {

    // TODO Couldn't simplify this;
    const node = state.parentNode.children[state.parentNode.children.length-1];
    const currentPos = state.currentPos;
    const nodeInnerContent = getInnerContent(state);

    if (isNextElementATag(state)) {
        if (state.content.trim().startsWith(ISIF)) {
            IsifTagParser.run(nodeInnerContent, state);
        } else {
            parse(nodeInnerContent, state, node);
        }
    } else {
        addTextToNode(nodeInnerContent, state);
    }

    return currentPos + nodeInnerContent.length;
};

const addTextToNode = (nodeInnerContent, state) => {
    const node = state.parentNode.newestChildNode;
    const innerTextNode = new IsmlNode(nodeInnerContent, state.currentLineNumber);
    node.addChild(innerTextNode);
};

const getInnerContent = oldState => {
    let state = Object.assign({}, oldState);
    const content = getUpdateContent(state);
    state = ClosingTagFinder.getCorrespondentClosingElementPosition(content, state);

    return pickInnerContent(state, content);
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

const reinitializeState = state => {
    state.insideTag = false;
    state.currentElement.asString = '';
    state.currentElement.initPosition = -1;
    state.currentElement.endPosition = -1;
};

const createNodeForCurrentElement = state => {

    state.depth -= 1;

    if (state.depth === 0) {
        if (isOpeningElem(state)) {
            state.ignoreUntil = createNode(state, state);
        }

        reinitializeState(state);
    }
};

const prepareStateForOpeningElement = state => {

    if (state.nonTagBuffer && state.nonTagBuffer.replace(/\s/g, '').length) {
        const node = new IsmlNode(state.nonTagBuffer);
        state.parentNode.addChild(node);
        reinitializeState(state);
        state.ignoreUntil += state.nonTagBuffer.length - 1;
        state.currentElement.asString = '<';
    }

    if (state.depth === 0) {
        state.currentElement.initPosition = state.currentPos;
    }

    state.insideTag = true;
    state.depth += 1;
};

const isEmptyLineDetected = (state, index) => state.lineBreakPositionList[index] === state.lineBreakPositionList[index + 1];

const setCurrentElementStartLineNumber = (state, i) => {

    const index = state.lineBreakPositionList.indexOf(i);

    state.currentPos = i;

    if (index !== -1) {
        state.currentLineNumber += 1;
    }

    getNextNonEmptyLine(state, index);

    if (!state.insideTag) {
        state.currentElement.startingLineNumber = state.currentLineNumber;
    }
};

const getNextNonEmptyLine = (state, index) => {

    while (isEmptyLineDetected(state, index)) {
        state.currentLineNumber += 1;
        index += 1;
    }
};

module.exports.build = build;
module.exports.parse = parse;
