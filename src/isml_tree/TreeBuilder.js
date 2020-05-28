const IsmlNode        = require('./IsmlNode');
const IsifTagParser   = require('./components/IsifTagParser');
const StateUtils      = require('./components/StateUtils');
const ParseUtils      = require('./components/ParseUtils');
const MultiClauseNode = require('./MultiClauseNode');
const ExceptionUtils  = require('../util/ExceptionUtils');
const GeneralUtils    = require('../util/GeneralUtils');
const MaskUtils       = require('./MaskUtils');
const Constants       = require('../Constants');
const fs              = require('fs');

const postProcess = (node, data = {}) => {
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        if (child.value.indexOf('template="util/modules"') !== -1) {
            data.moduleDefinition = {
                value      : child.value,
                lineNumber : child.lineNumber,
                globalPos  : child.globalPos,
                length     : child.value.trim().length
            };
        }

        if (child.isCustomIsmlTag()) {
            data.customModuleArray = data.customModuleArray || [];
            data.customModuleArray.push({
                value      : child.value,
                lineNumber : child.lineNumber,
                globalPos  : child.globalPos,
                length     : child.value.trim().length
            });
        }

        postProcess(child, data);
    }

    return data;
};

const build = (templatePath, content) => {

    const ParseStatus = require('../enums/ParseStatus');

    const result = {
        templatePath,
        status : ParseStatus.NO_ERRORS
    };

    try {
        const templateContent = GeneralUtils.toLF(content || fs.readFileSync(templatePath, 'utf-8'));
        result.rootNode       = parse(templateContent, undefined, undefined, templatePath);
        result.data           = postProcess(result.rootNode);

    } catch (e) {
        result.rootNode  = null;
        result.status    = ParseStatus.INVALID_DOM;
        result.exception = e.type === ExceptionUtils.types.UNKNOWN_ERROR ?
            e.message :
            e;
    }

    return result;
};

const parse = (content, parentState, parentNode = new IsmlNode(), templatePath) => {

    const state = StateUtils.getInitialState(GeneralUtils.toLF(content), parentState, parentNode, templatePath);

    for (let i = 0; i < content.length; i++) {
        initializeLoopState(state, i);

        if (!ParseUtils.isSkipIteraction(state)) {
            parseState(state);
        }
    }

    parseRemainingContent(state);

    return state.parentNode;
};

const initializeLoopState = (state, i) => {
    updateStateWhetherItIsInsideExpression(state);

    state.currentPos              = i;
    state.currentChar             = state.content.charAt(state.currentPos);
    state.currentElement.asString += state.currentChar;

    if (ParseUtils.isWhite(state)) {
        state.currentElement.startingLineNumber = state.currentLineNumber;
    }

    if (ParseUtils.isStopIgnoring(state)) {
        state.ignoreUntil = null;

        // TODO: There is probably a better way to handle deprecated ISML comments and HTML comments;
        if (state.currentElement.asString.trim().startsWith('<!--')) {
            state.currentElement.asString = state.currentChar;
        }
    }
};

const parseState = state => {
    const currentElement   = state.currentElement.asString.trim();
    const isHtmlComment    = currentElement.startsWith('<!--') && currentElement.endsWith('-->');
    const isOpeningTagChar = state.currentChar === '<';
    const isClosingTagChar = state.currentChar === '>' && !currentElement.startsWith('<!--') || isHtmlComment;

    if (isOpeningTagChar && !currentElement.startsWith('<!--')) {
        prepareStateForOpeningElement(state);
    } else if (isClosingTagChar) {
        createNodeForCurrentElement(state);
    } else if (ParseUtils.isWhite(state) || currentElement.startsWith('<!--')) {
        state.nonTagBuffer += state.currentChar;
    } else if (state.content.substring(state.currentPos).startsWith('!-')) {
        state.nonTagBuffer += '<!-';
    }
};

const updateStateWhetherItIsInsideExpression = state => {
    if (!ParseUtils.isWhite(state)) {
        if (ParseUtils.isOpeningIsmlExpression(state) && !state.nonTagBuffer.trim().startsWith('<!--')) {
            state.insideExpression = true;
            state.ignoreUntil      = state.currentPos + state.content.substring(state.currentPos).indexOf('}');
        } else if (ParseUtils.isClosingIsmlExpression(state)) {
            state.insideExpression = false;
        }
    }
};

const createNode = oldState => {
    const state     = Object.assign({}, oldState);
    updateStateLinesData(state);
    const globalPos = ParseUtils.getGlobalPos(state);

    const isIsifNode = ParseUtils.isCurrentElementIsifTag(state);
    const node       = isIsifNode ?
        new MultiClauseNode() :
        new IsmlNode(state.currentElement.asString, state.currentElement.startingLineNumber, globalPos);

    state.parentNode.addChild(node);

    if (node.isSelfClosing()) {
        return null;
    }

    const innerParseResult    = parseNewNodeInnerContent(state);
    const innerContentLastPos = innerParseResult.innerContentLastPosition;
    const suffixableNode      = isIsifNode ? node.getLastChild() : node;

    const suffixValue      = state.closingElementsStack.pop().trim();
    const suffixLineNumber = innerParseResult.suffixLineNumber;
    const suffixGlobalPos  = innerParseResult.suffixGlobalPos;

    suffixableNode.setSuffix(suffixValue, suffixLineNumber, suffixGlobalPos);

    return innerContentLastPos;
};

const parseNewNodeInnerContent = state => {

    const parentNode       = state.parentNode.newestChildNode;
    const nodeInnerContent = ParseUtils.getInnerContent(state);
    let remainingContent   = nodeInnerContent;

    if (!ParseUtils.isNextElementATag(nodeInnerContent)) {
        remainingContent = parseTextNode(state, nodeInnerContent);
    }

    if (remainingContent) {
        if (ParseUtils.isCurrentElementIsifTag(state)) {
            IsifTagParser.run(remainingContent, state);
        } else {
            parse(remainingContent, state, parentNode);
        }
    }

    const stateStartingPos          = state.parentState ? getCurrentStateStartingPos(state.parentState) : 0;
    const index                     = state.content.lastIndexOf('<');
    const currentStateContentLength = state.content.substring(0, index).length;
    const suffixGlobalPos           = stateStartingPos + currentStateContentLength;
    const currentLineNumber         = getSuffixLineNumber(state);

    return {
        innerContentLastPosition : state.currentPos + nodeInnerContent.length,
        suffixLineNumber         : currentLineNumber,
        suffixGlobalPos          : suffixGlobalPos
    };
};

const getSuffixLineNumber = state => {
    const closingTagStackCopy = [...state.closingElementsStack];
    const elem                = closingTagStackCopy.pop();
    const currentNode         = state.parentNode.getLastChild();

    const innerContent             = ParseUtils.getInnerContent(state);
    const nodeValueLineBreakQty    = ParseUtils.getLineBreakQty(currentNode.value.trim());
    const innerContentLineBreakQty = ParseUtils.getLineBreakQty(innerContent);
    const suffixLineNumber         = elem.indexOf('</isif>') !== -1 ?
        state.currentLineNumber :
        currentNode.lineNumber + nodeValueLineBreakQty + innerContentLineBreakQty;

    return suffixLineNumber;
};

const getCurrentStateStartingPos = state => {
    let accumulatedValue = 0;
    let iterator         = state;

    do {
        accumulatedValue += iterator.currentElement.asString.length;
        iterator         = iterator.parentState;
    } while (iterator);

    return accumulatedValue;
};

const createTextNodeFromMainLoop = state => {
    if (state.nonTagBuffer && state.nonTagBuffer.replace(/\s/g, '').length) {
        const lineBreakQty = ParseUtils.getPrecedingEmptyLinesQty(state.nonTagBuffer);
        const globalPos    = ParseUtils.getNextNonEmptyCharPos(state.nonTagBuffer);
        const lineNumber   = state.currentLineNumber + lineBreakQty;
        const node         = new IsmlNode(state.nonTagBuffer, lineNumber, globalPos);

        state.currentLineNumber                 += ParseUtils.getLineBreakQty(state.nonTagBuffer);
        state.parentNode.addChild(node);
        StateUtils.initializeCurrentElement(state);
        state.currentElement.startingLineNumber = state.currentLineNumber;
        state.currentElement.asString           = '<';
        state.ignoreUntil                       += state.nonTagBuffer.length - 1;
    }
};

const createTextNodeFromInnerContent = (text, state, parentNode) => {
    if (text) {
        const lineBreakQty  = ParseUtils.getPrecedingEmptyLinesQty(text);
        const globalPos     = ParseUtils.getTextGlobalPos(state, text);
        const innerTextNode = new IsmlNode(text, state.currentLineNumber + lineBreakQty, globalPos);

        state.currentLineNumber += ParseUtils.getLineBreakQty(text);

        parentNode.addChild(innerTextNode);
    }
};

const createNodeForCurrentElement = state => {
    ParseUtils.lighten(state);

    if (ParseUtils.isWhite(state)) {
        const lineBreakQty = ParseUtils.getLineBreakQty(state.currentElement.asString);

        state.currentLineNumber += lineBreakQty;

        if (ParseUtils.isOpeningElem(state)) {
            state.ignoreUntil = createNode(state);
        }

        StateUtils.initializeCurrentElement(state);
    }
};

const prepareStateForOpeningElement = state => {
    createTextNodeFromMainLoop(state);

    if (ParseUtils.isWhite(state)) {
        state.currentElement.initPosition = state.currentPos;
    }

    ParseUtils.darken(state);
};

const updateStateLinesData = state => {
    const emptyLinesQty                     = ParseUtils.getPrecedingEmptyLinesQty(state.currentElement.asString);
    state.currentElement.startingLineNumber += emptyLinesQty;

    if (state.parentState && !state.node.isMulticlause()) {
        state.parentState.currentElement.startingLineNumber += emptyLinesQty;
    }
};

const parseRemainingContent = state => {
    const trailingTextValue = state.nonTagBuffer;

    if (trailingTextValue) {
        if (trailingTextValue.trim()) {
            const lineBreakQty = ParseUtils.getPrecedingEmptyLinesQty(trailingTextValue);
            const globalPos    = ParseUtils.getNextNonEmptyCharPos(trailingTextValue);
            const node         = new IsmlNode(trailingTextValue, state.currentLineNumber + lineBreakQty, globalPos);

            state.parentNode.addChild(node);
        } else {
            let lastNode = state.parentNode.getLastChild() || state.parentNode;

            if (lastNode.isMulticlause()) {
                lastNode = lastNode.getLastChild();
            }

            lastNode.suffixValue ?
                lastNode.suffixValue += trailingTextValue :
                lastNode.value       += trailingTextValue ;
        }
    }
};

const parseTextNode = (state, nodeInnerContent) => {
    const parentNode    = state.parentNode.newestChildNode;
    let content         = nodeInnerContent;
    let textNodeParent  = state.parentNode.newestChildNode;
    const textNodeValue = getTextNodeValue(nodeInnerContent, content, parentNode);

    if (parentNode.isMulticlause()) {
        const node     = new IsmlNode(state.currentElement.asString, state.currentElement.startingLineNumber);
        textNodeParent = node;
        parentNode.addChild(node);
    }

    createTextNodeFromInnerContent(textNodeValue, state, textNodeParent);
    content = content.substring(textNodeValue.length);

    return content;
};

const getTextNodeValue = (nodeInnerContent, content, parentNode) => {
    let textNodeValue = nodeInnerContent;

    const maskedText          = MaskUtils.maskIgnorableContent(textNodeValue);
    const firstOpeningCharPos = maskedText.indexOf('<');

    if (ParseUtils.isNextElementAnIsmlExpression(content)) {
        if (parentNode.isMulticlause()) {
            textNodeValue = content.substring(0, firstOpeningCharPos) || textNodeValue;
        } else {
            const textNodeContent                  = content.substring(0, firstOpeningCharPos);
            const lastEOLBeforeFirstOpeningCharPos = textNodeContent.lastIndexOf(Constants.EOL);

            textNodeValue = content.substring(0, lastEOLBeforeFirstOpeningCharPos) || textNodeValue;
        }
    }
    else if (!parentNode.isOfType(['iscomment', 'isscript'])) {
        textNodeValue = maskedText.substring(0, firstOpeningCharPos) || textNodeValue;
    }

    return textNodeValue;
};

module.exports.build = build;
module.exports.parse = parse;
