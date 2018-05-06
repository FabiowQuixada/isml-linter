const IsmlNode = require('./IsmlNode');
const fs = require('fs');

const build = filePath => {
    const fileContent = fs.readFileSync(filePath, 'utf-8').replace(/(\r\n\t|\n|\r\t)/gm, '');
    const rootNode = new IsmlNode();

    parse(fileContent, rootNode);

    return rootNode;
};

const parse = (content, parentNode) => {
    let elementAsString = '';
    let elemInitPosition = 0;
    let ignoreUntil = null;

    for (let i = 0; i < content.length; i++) {

        if (ignoreUntil && ignoreUntil >= i) {
            continue;
        } else if (ignoreUntil && ignoreUntil < i) {
            ignoreUntil = null;
        }

        const c = content.charAt(i);

        elementAsString += c;

        if (c === '<') {
            elemInitPosition = i;
        } else if (c === '>') {
            if (isOpeningElem(content, elementAsString, elemInitPosition)) {

                const node = new IsmlNode();
                node.setValue(elementAsString.trim());
                parentNode.addChild(node);

                if (!node.isSelfClosing()) {
                    const nodeInnerContent = getInnerContent(content.substring(elemInitPosition, content.length));
                    ignoreUntil = i + nodeInnerContent.length;

                    parse(nodeInnerContent.trim(), node);
                }
            }

            elementAsString = '';
        }
    }
};

const isOpeningElem = (content, elem, currPos) => {
    const c = content.charAt(currPos);
    const c2 = content.charAt(currPos+1);
    return c === '<' && c2 !== '/';
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
