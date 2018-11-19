const IsmlNode = require('./IsmlNode');
const IsifTagParser = require('./components/IsifTagParser');
const StateUtils = require('./components/StateUtils');
const ParseUtils = require('./components/ParseUtils');
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

    let state = StateUtils.getInitialState(content, parentState, parentNode);

    for (let i = 0; i < content.length; i++) {
        setCurrentElementStartLineNumber(state, i);
        state = iterate(state);
    }

    return state.parentNode;
};

const iterate = state => {
    state = initializeLoopState(state);

    if (ParseUtils.isSkipIteraction(state)) {
        return state;
    }

    state = parseState(state);

    return state;
};

const initializeLoopState = oldState => {
    let state = Object.assign({}, oldState);

    state.currentChar = state.contentAsArray.charAt(state.currentPos);
    state.currentElement.asString += state.currentChar;

    state = updateStateWhetherItIsInsideExpression(state);

    if (ParseUtils.isStopIgnoring(state)) {
        state.ignoreUntil = null;
    }

    return state;
};

const parseState = oldState => {

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
        if (ParseUtils.isOpeningIsmlExpression(state)) {
            state.insideExpression = true;
        } else if (ParseUtils.isClosingIsmlExpression(state)) {
            state.insideExpression = false;
        }
    }

    return state;
};

const createNode = state => {

    const emptyLinesQty = ParseUtils.getNumberOfPrecedingEmptyLines(state.currentElement.asString);
    updateStateLinesData(state, emptyLinesQty);

    const isIsifNode = state.currentElement.asString.trim().startsWith(ISIF);
    const node = isIsifNode ?
        new MultiClauseNode() :
        new IsmlNode(state.currentElement.asString, state.currentElement.startingLineNumber);

    state.parentNode.addChild(node);

    if (node.isSelfClosing()) {
        return null;
    }

    return parseNewNodeInnerContent(state);
};

const parseNewNodeInnerContent = state => {

    // TODO Couldn't simplify this;
    const node = state.parentNode.children[state.parentNode.children.length-1];
    const currentPos = state.currentPos;
    const nodeInnerContent = ParseUtils.getInnerContent(state);

    if (ParseUtils.isNextElementATag(state)) {
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

const createNodeForCurrentElement = state => {

    state.depth -= 1;

    const lineBreakQty = (state.currentElement.asString.match(/\n/g) || []).length;

    state.currentLineNumber += lineBreakQty;

    if (state.depth === 0) {
        if (ParseUtils.isOpeningElem(state)) {
            state.ignoreUntil = createNode(state);
        }

        StateUtils.reinitializeState(state);
    }
};

const prepareStateForOpeningElement = state => {

    if (state.nonTagBuffer && state.nonTagBuffer.replace(/\s/g, '').length) {
        const node = new IsmlNode(state.nonTagBuffer);
        state.parentNode.addChild(node);
        StateUtils.reinitializeState(state);
        state.ignoreUntil += state.nonTagBuffer.length - 1;
        state.currentElement.asString = '<';
    }

    if (state.depth === 0) {
        state.currentElement.initPosition = state.currentPos;
    }

    state.insideTag = true;
    state.depth += 1;
};

const setCurrentElementStartLineNumber = (state, i) => {

    state.currentPos = i;

    if (!state.insideTag) {
        state.currentElement.startingLineNumber = state.currentLineNumber;
    }
};

const updateStateLinesData = (state, emptyLinesQty) => {

    state.currentElement.startingLineNumber += emptyLinesQty;

    if (state.parentState) {
        state.parentState.currentElement.startingLineNumber += emptyLinesQty;
    }
};

module.exports.build = build;
module.exports.parse = parse;
