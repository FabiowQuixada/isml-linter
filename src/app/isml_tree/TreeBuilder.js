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

        const fileContent = fs.readFileSync(filePath, 'utf-8').replace(/(\r\n\t|\n|\r\t)/gm, '');

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
const parse = (parentNode, content) => {
    let state = getInitialState(content);

    for (let i = 0; i < content.length; i++) {
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

const getInitialState = content => {
    return {
        content: content,
        currentElementAsString: '',
        currentElemInitPosition: -1,
        currentElemEndPosition: -1,
        currentChar: null,
        currentPos: -1,
        ignoreUntil: null,
        insideTag: false,
        nonTagBuffer: '',
        insideExpression: false,
        depth: 0
    };
};

const initializeLoopState = (oldState, i) => {
    let newState = Object.assign({}, oldState);

    newState.currentChar = newState.content.charAt(i);
    newState.currentElementAsString += newState.currentChar;
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

        if (newState.nonTagBuffer && newState.nonTagBuffer.replace(/\s/g, '').length) {
            const node = new IsmlNode(newState.nonTagBuffer);

            parentNode.addChild(node);

            reinitializeState(newState);
            newState.ignoreUntil += newState.nonTagBuffer.length - 1;
            newState.currentElementAsString = '<';
        }

        if (newState.depth === 0) {
            newState.currentElemInitPosition = newState.currentPos;
        }

        newState.insideTag = true;
        newState.depth +=1;
    } else if (newState.currentChar === '>') {
        newState.depth -= 1;

        if (newState.depth === 0) {
            if (isOpeningElem(newState)) {
                newState.ignoreUntil = createNode(parentNode, newState);
            }

            reinitializeState(newState);
        }
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

    if (state.currentElementAsString.trim().startsWith(ISIF)) {
        node = new MultiClauseNode();
    } else {
        node = new IsmlNode(state.currentElementAsString);
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
            IsifTagParser.run(node, nodeInnerContent, state.currentElementAsString);
        } else {
            parse(node, nodeInnerContent.trim());
        }
    } else {
        addTextToNode(node, nodeInnerContent.trim());
    }

    return currentPos + nodeInnerContent.length;
};

const addTextToNode = (node, nodeInnerContent) => {
    const innerTextNode = new IsmlNode(nodeInnerContent);
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
    const currentElemInitPosition = state.currentElemInitPosition;
    content = content.substring(currentElemInitPosition, content.length);
    return content;
};

const pickInnerContent = (state, content) => {

    const innerContentStartPos = state.currentElemEndPosition+1;
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
    const currPos = state.currentElemInitPosition;

    const currenChar = content.charAt(currPos);
    const nextChar = content.charAt(currPos+1);

    return currenChar === '<' && nextChar !== '/';
};

const isNextElementATag = state => getNextNonEmptyChar(state) === '<';

const reinitializeState = newState => {
    newState.nonTagBuffer = null;
    newState.insideTag = false;
    newState.currentElementAsString = '';
    newState.currentElemInitPosition = -1;
    newState.currentElemEndPosition = -1;
};

module.exports.build = build;
module.exports.parse = parse;
