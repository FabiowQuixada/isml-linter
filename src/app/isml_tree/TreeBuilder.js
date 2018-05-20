const IsmlNode = require('./IsmlNode');
const ClosingTagFinder = require('./components/ClosingTagFinder');
const fs = require('fs');

const build = filePath => {
    const fileContent = fs.readFileSync(filePath, 'utf-8').replace(/(\r\n\t|\n|\r\t)/gm, '');
    const rootNode = new IsmlNode();

    parse(rootNode, fileContent);

    return rootNode;
};

const parse = (parentNode, content) => {
    let parseState = {
        content: content,
        currentElementAsString: '',
        currentElemInitPosition: -1,
        currentChar: null,
        currentPos: -1,
        ignoreUntil: null,
        insideTag: false,
        insideExpression: false
    };

    for (let i = 0; i < content.length; i++) {

        parseState.currentChar = content.charAt(i);
        parseState.currentElementAsString += parseState.currentChar;
        parseState.currentPos = i;

        if (parseState.ignoreUntil) {
            if (i > parseState.ignoreUntil && parseState.ignoreUntil !== content.length + 1) {
                parseState.ignoreUntil = null;
            } else if (parseState.ignoreUntil >= i) {
                continue;
            }
        }

        parseState = updateParseState(parseState);

        if (parseState.insideTag && parseState.insideExpression) {
            continue;
        }

        if (parseState.currentChar === '<') {
            parseState.currentElemInitPosition = i;
            parseState.insideTag = true;
        } else if (parseState.currentChar === '>') {

            if (isOpeningElem(parseState)) {
                parseState.ignoreUntil = createNode(parentNode, parseState);
            }

            parseState.insideTag = false;
            parseState.currentElementAsString = '';
            parseState.currentElemInitPosition = -1;
        }
    }
};

const updateParseState = oldParseState => {
    const newParseState = Object.assign({}, oldParseState);

    if (oldParseState.insideTag) {
        if (isOpeningIsmlExpression(oldParseState)) {
            newParseState.insideExpression = true;
        } else if (isClosingIsmlExpression(oldParseState)) {
            newParseState.insideExpression = false;
        }
    }

    return newParseState;
};

const createNode = (parentNode, parseState) => {
    const node = new IsmlNode();
    node.setValue(parseState.currentElementAsString.trim());
    parentNode.addChild(node);

    if (!node.isSelfClosing()) {
        return handleInnerContent(node, parseState);
    }

    return null;
};

const handleInnerContent = (node, parseState) => {

    const content = parseState.content;
    const currentPos = parseState.currentPos;
    const currentElemInitPosition = parseState.currentElemInitPosition;

    const nodeInnerContent = getInnerContent(content.substring(currentElemInitPosition, content.length));

    if (isNextElementATag(parseState)) {
        parse(node, nodeInnerContent.trim());
    } else {
        addTextToNode(node, nodeInnerContent.trim());
    }

    return currentPos + nodeInnerContent.length;
};

const addTextToNode = (node, nodeInnerContent) => {
    const innerTextNode = new IsmlNode();
    innerTextNode.setValue(nodeInnerContent);
    node.addChild(innerTextNode);
};

const getInnerContent = content => {
    const openingElemPosition = content.indexOf('>');
    const closingElemPosition = ClosingTagFinder.getCorrespondentClosingElementPosition(content);

    return content.substring(openingElemPosition+1, closingElemPosition);
};

const getNextNonEmptyChar = parseState => {

    const content = parseState.content;
    const currentPos = parseState.currentPos;

    return content.substring(currentPos+1, content.length-1).trim()[0];
};

const isOpeningIsmlExpression = parseState => {

    const content = parseState.content;
    const currentPos = parseState.currentPos;

    const currChar = content.charAt(currentPos);
    const nextChar = content.charAt(currentPos+1);

    return currChar === '$' && nextChar === '{';
};

const isClosingIsmlExpression = parseState => {

    const content = parseState.content;
    const currentPos = parseState.currentPos;
    const insideExpression = parseState.insideExpression;

    return insideExpression && content.charAt(currentPos-1) === '}';
};

const isOpeningElem = parseState => {

    const content = parseState.content;
    const currPos = parseState.currentElemInitPosition;

    const currenChar = content.charAt(currPos);
    const nextChar = content.charAt(currPos+1);

    return currenChar === '<' && nextChar !== '/';
};

const isNextElementATag = parseState => getNextNonEmptyChar(parseState) === '<';

module.exports = {
    build
};
