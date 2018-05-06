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

    for (let i = 0; i < content.length; i++) {
        const c = content.charAt(i);

        elementAsString += c;

        if (c === '<') {
            elemInitPosition = i;
        } else if (c === '>') {
            if (isOpeningElem(content, elementAsString, elemInitPosition)) {
                const node = new IsmlNode();
                node.setValue(elementAsString);
                parentNode.addChild(node);
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

module.exports = {
    build
};
