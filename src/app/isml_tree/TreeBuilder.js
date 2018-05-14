const IsmlNode = require('./IsmlNode');
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
    const closingElemPosition = getCorrespondentClosingElementPosition(content);

    return content.substring(openingElemPosition+1, closingElemPosition);
};

const getFirstElementType = elementAsString => {
    let result = elementAsString.substring(elementAsString.indexOf('<') + 1, elementAsString.indexOf('>'));

    // In case the tag has attributes;
    if (result.indexOf(' ') !== -1) {
        result = result.split(' ')[0];
    }

    return result;
};

const getNextNonEmptyChar = parseState => {

    const content = parseState.content;
    const currentPos = parseState.currentPos;

    return content.substring(currentPos+1, content.length-1).trim()[0];
};

/**
 * The purpose of this function is to find the corresponding closing element of an HTML/ISML element,
 * which we will name 'E'. 'E' is the first element found in the 'content' string.


 * The function will return as soon as it finds the corresponding closing element, so the 'content' string does
 * not have to be a balanced HTML/ISML representation, since it will ignore everything after that.

 * The 'depth' variable works as a stack, taking into account only elements of type 'E'
*/
const getCorrespondentClosingElementPosition = content => {
    const elem = getFirstElementType(content);
    const elemType = getFirstElementType(elem);
    const stack = [];
    const openingElemRegex = /<[a-zA-Z]*(\s|>|\/)/;
    const closingElemRegex = /<\/.[a-zA-Z]*>/;
    const ismlExpressionRegex = /\$\{.*\}/;

    let tempContent = content;
    let openingElemPos = -1;
    let closingElementPos = -1;
    let result = -1;
    let currentReadingPos = 0;

    tempContent = replaceIsmlExpressionWithPlaceholder(tempContent);


    while (tempContent && openingElemPos !== Number.POSITIVE_INFINITY && closingElementPos !== Number.POSITIVE_INFINITY) {

        const firstClosingElemPos = tempContent.indexOf('>')+1;
        const isSelfClosingElement = tempContent.charAt(firstClosingElemPos-2) === '/';

        openingElemPos = Number.POSITIVE_INFINITY;
        closingElementPos = Number.POSITIVE_INFINITY;

        const openingElem = openingElemRegex.exec(tempContent);
        const closingElement = closingElemRegex.exec(tempContent);

        if (openingElem) {
            openingElemPos = openingElem.index;
        }

        if (closingElement) {
            closingElementPos = closingElement.index;
        }

        if (tempContent.replace(/\$\{.*\}/, '').trim()[0] === '<') {
            currentReadingPos += firstClosingElemPos;
        } else {
            currentReadingPos += tempContent.indexOf('<');
            tempContent = tempContent.replace(/\$\{.*\}/, '').substring(tempContent.indexOf('<'), tempContent.length);
            continue;
        }

        if (!isSelfClosingElement) {
            if (openingElemPos < closingElementPos) {
                stack.push('openingElem[0]');
            } else {
                stack.pop();
            }
        }

        tempContent = tempContent.substring(firstClosingElemPos, tempContent.length);

        if (!stack.length) {
            result = currentReadingPos - firstClosingElemPos;
            break;
        }

        openingElemRegex.lastIndex = 0;
        closingElemRegex.lastIndex = 0;
    }

    return result;
};

/**
 * Replaces '${...}' with '======', so it facilites next processes. For Example,
 * if ${ 3 < 4 } is present, the '<' symbol might be thought as an opening tag
 * symbol. The same is valid for <isscript> and <iscomment> tags;
 */
const replaceIsmlExpressionWithPlaceholder = content => {
    let result = content;

    result = replaceContent(result, '${', '}');

    return result;
};

const replaceContent = (content, init, end) => {
    const placeholderSymbol = '_';
    let result = content;

    while (result.indexOf(init) !== -1) {
        let placeholder = '';
        a = result.indexOf(init);
        b = result.indexOf(end);

        for (let i = a; i <= b; i++) { placeholder += placeholderSymbol; }

        result = result.substring(0, a) +
                 placeholder +
                 result.substring(b+1, result.length+1);
    }

    return result;
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
