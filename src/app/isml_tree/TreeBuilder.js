const IsmlNode        = require('./IsmlNode');
const IsifTagParser   = require('./components/IsifTagParser');
const StateUtils      = require('./components/StateUtils');
const ParseUtils      = require('./components/ParseUtils');
const MultiClauseNode = require('./MultiClauseNode');
const ExceptionUtils  = require('../util/ExceptionUtils');
const fs              = require('fs');

const build = filePath => {

    const ParseStatus = require('../enums/ParseStatus');

    const result = {
        filePath,
        status : ParseStatus.NO_ERRORS
    };

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        result.rootNode   = parse(fileContent, undefined, undefined, filePath);
    } catch (e) {
        result.rootNode  = null;
        result.status    = ParseStatus.INVALID_DOM;
        result.exception = e === ExceptionUtils.types.UNKNOWN_ERROR ?
            ExceptionUtils.getParseErrorMessage(filePath) :
            e;
    }

    return result;
};

const parse = (content, parentState, parentNode = new IsmlNode(), filePath) => {

    let state = StateUtils.getInitialState(content, parentState, parentNode, filePath);

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

    state.currentChar             = state.originalContent.charAt(state.currentPos);
    state.currentElement.asString += state.currentChar;

    state = updateStateWhetherItIsInsideExpression(state);

    if (ParseUtils.isStopIgnoring(state)) {
        state.ignoreUntil = null;
    }

    return state;
};

const parseState = oldState => {

    const state = Object.assign({}, oldState);

    const currentElement   = state.currentElement.asString.trim();
    const isHtmlComment    = currentElement.startsWith('<!--') && currentElement.endsWith('-->');
    const isOpeningTagChar = state.currentChar === '<';
    const isClosingTagChar = state.currentChar === '>' && !currentElement.startsWith('<!--') || isHtmlComment;

    if (isOpeningTagChar) {
        prepareStateForOpeningElement(state);
    } else if (isClosingTagChar) {
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
            state.ignoreUntil      = state.currentPos + state.originalContent.substring(state.currentPos).indexOf('}');
        } else if (ParseUtils.isClosingIsmlExpression(state)) {
            state.insideExpression = false;
        }
    }

    return state;
};

const createNode = state => {

    const emptyLinesQty = ParseUtils.getNumberOfPrecedingEmptyLines(state.currentElement.asString);
    updateStateLinesData(state, emptyLinesQty);

    const isIsifNode = ParseUtils.isCurrentElementIsifTag(state);
    const node       = isIsifNode ?
        new MultiClauseNode() :
        new IsmlNode(state.currentElement.asString, state.currentElement.startingLineNumber);

    state.parentNode.addChild(node);

    if (node.isSelfClosing()) {
        return null;
    }

    const innerContentLastPos = parseNewNodeInnerContent(state);

    isIsifNode ?
        node.getLastChild().suffix = state.closingElementsStack.pop() :
        node.suffix = state.closingElementsStack.pop();

    return innerContentLastPos;
};

const parseNewNodeInnerContent = state => {

    // TODO Couldn't simplify this;
    const parentNode       = state.parentNode.children[state.parentNode.children.length-1];
    const currentPos       = state.currentPos;
    const nodeInnerContent = ParseUtils.getInnerContent(state);

    if (ParseUtils.isNextElementATag(nodeInnerContent)) {
        if (ParseUtils.isCurrentElementIsifTag(state)) {
            IsifTagParser.run(nodeInnerContent, state);
        } else {
            parse(nodeInnerContent, state, parentNode);
        }
    } else {
        let textNodeParent = state.parentNode.newestChildNode;

        if (parentNode instanceof MultiClauseNode) {
            const node     = new IsmlNode(state.currentElement.asString, state.currentElement.startingLineNumber);
            textNodeParent = node;
            parentNode.addChild(node);
        }
        if (nodeInnerContent) {
            addTextToNode(nodeInnerContent, state, textNodeParent);
        }
    }

    return currentPos + nodeInnerContent.length;
};

const addTextToNode = (text, state, parentNode) => {

    const lineBreakQty  = ParseUtils.getNumberOfPrecedingEmptyLines(text);
    const innerTextNode = new IsmlNode(text, state.currentLineNumber + lineBreakQty);

    if (innerTextNode) {
        parentNode.addChild(innerTextNode);
    }
};

const createNodeForCurrentElement = state => {

    state.depth -= 1;

    if (state.depth === 0) {
        const lineBreakQty = ParseUtils.getLineBreakQty(state.currentElement.asString);

        state.currentLineNumber += lineBreakQty;
    }

    if (!ParseUtils.isIsmlTagInsideHtmlTag(state)) {
        if (ParseUtils.isOpeningElem(state)) {
            state.ignoreUntil = createNode(state);
        }

        StateUtils.reinitializeState(state);
    }
};

const prepareStateForOpeningElement = state => {

    if (state.nonTagBuffer && state.nonTagBuffer.replace(/\s/g, '').length) {
        const node                    = new IsmlNode(state.nonTagBuffer);
        state.parentNode.addChild(node);
        StateUtils.reinitializeState(state);
        state.ignoreUntil             += state.nonTagBuffer.length - 1;
        state.currentElement.asString = '<';
    }

    if (state.depth === 0) {
        state.currentElement.initPosition = state.currentPos;
    }

    state.insideTag = true;
    state.depth     += 1;
};

const setCurrentElementStartLineNumber = (state, i) => {

    state.currentPos = i;

    if (!state.insideTag) {
        state.currentElement.startingLineNumber = state.currentLineNumber;
    }
};

const updateStateLinesData = (state, emptyLinesQty) => {

    state.currentElement.startingLineNumber += emptyLinesQty;

    if (state.parentState && !(state.node instanceof MultiClauseNode)) {
        state.parentState.currentElement.startingLineNumber += emptyLinesQty;
    }
};

module.exports.build = build;
module.exports.parse = parse;
