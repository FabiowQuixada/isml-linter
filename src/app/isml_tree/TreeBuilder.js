const IsmlNode = require('./IsmlNode');
const fs = require('fs');

const build = filePath => {
    const fileContent = fs.readFileSync(filePath, 'utf-8').replace(/(\r\n\t|\n|\r\t)/gm, '');
    const rootNode = new IsmlNode();

    parse(rootNode, fileContent);

    return rootNode;
};

const parse = (parentNode, content) => {
    let currentElementAsString = '';
    let currentElemInitPosition = 0;
    let ignoreUntil = null;

    for (let i = 0; i < content.length; i++) {

        const currentChar = content.charAt(i);
        currentElementAsString += currentChar;

        if (ignoreUntil) {
            if (i > ignoreUntil && ignoreUntil !== content.length + 1) {
                ignoreUntil = null;
            } else if (ignoreUntil >= i) {
                continue;
            }
        }

        if (currentChar === '<') {
            currentElemInitPosition = i;
        } else if (currentChar === '>') {
            if (isOpeningElem(content, currentElementAsString, currentElemInitPosition)) {
                ignoreUntil = createNode(parentNode, content, i, currentElementAsString, currentElemInitPosition);
            }

            currentElementAsString = '';
        }
    }
};

const createNode = (parentNode, content, currentPos, currentElementAsString, currentElemInitPosition) => {
    const node = new IsmlNode();
    node.setValue(currentElementAsString.trim());
    parentNode.addChild(node);

    if (!node.isSelfClosing()) {
        return handleInnerContent(node, content, currentPos, currentElemInitPosition);
    }

    return null;
};

const handleInnerContent = (node, content, currentPos, currentElemInitPosition) => {
    const nodeInnerContent = getInnerContent(content.substring(currentElemInitPosition, content.length));

    if (nextElementIsATag(content, currentPos)) {
        parse(node, nodeInnerContent.trim());
    } else {
        addTextToNode(node, nodeInnerContent.trim());
    }

    return currentPos + nodeInnerContent.length;
};

const isOpeningElem = (content, elem, currPos) => {
    const currenChar = content.charAt(currPos);
    const nextChar = content.charAt(currPos+1);

    return currenChar === '<' && nextChar !== '/';
};

const nextElementIsATag = (content, currentPos) => nextNonEmptyChar(content, currentPos) === '<';

const addTextToNode = (node, nodeInnerContent) => {
    const innerTextNode = new IsmlNode();
    innerTextNode.setValue(nodeInnerContent);
    node.addChild(innerTextNode);
};

const getInnerContent = content => {
    const elemType = getCurrentElementType(content);
    const openingElemPosition = content.indexOf('>');
    const closingElemPosition = findCorrespondentClosingElementPosition(content, elemType);

    return content.substring(openingElemPosition+1, closingElemPosition);
};

const getCurrentElementType = elementAsString => {
    let result = elementAsString.substring(elementAsString.indexOf('<') + 1, elementAsString.indexOf('>'));

    // In case the tag has attributes;
    if (result.indexOf(' ') !== -1) {
        result = result.split(' ')[0];
    }

    return result;
};

const nextNonEmptyChar = (content, pos) => {
    return content.substring(pos+1, content.length-1).trim()[0];
};

/**
 * The purpose of this function is to find the corresponding closing element of an HTML/ISML element,
 * which we will name 'E'. 'E' is the first element found in the 'content' string.


 * The function will return as soon as it finds the corresponding closing element, so the 'content' string does
 * not have to be a balanced HTML/ISML representation, since it will ignore everything after that.

 * The 'depth' variable works as a stack, taking into account only elements of type 'E'
*/
const findCorrespondentClosingElementPosition = (content, elem) => {
    return content.indexOf('</' + elem + '>');
};

module.exports = {
    build
};
