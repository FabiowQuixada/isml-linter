const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = 'Only one element per line is allowed';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(node) {
    return !node.isRoot() &&
        node.getLineNumber() === node.getParent().getLineNumber();
};

Rule.getFixedContent = rootNode => {
    fixContent(rootNode);

    return rootNode.toString();
};

const fixContent = node => {
    node.getChildren().forEach( child => {
        if (child.isInSameLineAsParent() && !node.isIsmlComment()) {
            const indentation       = getCorrectIndentation(child);
            const parentIndentation = getCorrectIndentation(node);

            child.setValue(`\n${indentation}${child.getValue()}\n${parentIndentation}`);

            if (child.getSuffixValue()) {
                child.setSuffix(`\n${indentation}${child.getSuffixValue()}\n`);
            }
        }

        fixContent(child);
    });
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
