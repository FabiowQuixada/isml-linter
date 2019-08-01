const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = 'Only one element per line is allowed';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(node) {
    return !node.isRoot() &&
        node.lineNumber === node.parent.lineNumber;
};

Rule.getFixedContent = rootNode => {
    fixContent(rootNode);

    return rootNode.toString();
};

const fixContent = node => {
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        if (child.isInSameLineAsParent() && !node.isIsmlComment()) {
            const indentation       = getCorrectIndentation(child);
            const parentIndentation = getCorrectIndentation(node);

            child.value = `\n${indentation}${child.value}\n${parentIndentation}`;

            if (child.suffixValue) {
                child.setSuffix(`\n${indentation}${child.suffixValue}\n`);
            }
        }

        fixContent(child);
    }
};

const getCorrectIndentation = node => {
    const indentSize = node.depth - 1;
    let indentation  = '';

    for (let i = 0; i < indentSize; ++i) {
        indentation += '    ';
    }

    return indentation;
};

module.exports = Rule;
