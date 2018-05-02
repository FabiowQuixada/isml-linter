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

    for (let i = 0; i < content.length; i++) {
        const c = content.charAt(i);

        elementAsString += c;

        if (c === '>') {
            const node = new IsmlNode();
            node.setValue(elementAsString);
            parentNode.addChild(node);

            elementAsString = '';
        }

    }
};

module.exports = {
    build
};
