const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = 'Line incorrectly indented';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleName, description);

Rule.getDefaultAttrs = () => {
    return {
        size : 4
    };
};

Rule.getIndentation = function(depth = 1) {
    const indentationSize = this.getConfigs().size * depth;
    let indentation       = '';

    for (let i = 0; i < indentationSize; ++i) {
        indentation += ' ';
    }

    return indentation;
};

Rule.isBroken = function(node) {

    const configIndentSize    = this.getConfigs().size;
    const expectedIndentation = (node.getDepth() - 1) * configIndentSize;
    const actualIndentation   = node.getIndentationSize();

    return !node.isRoot() &&
        !node.isEmpty() &&
        !node.isInSameLineAsParent() &&
        expectedIndentation !== actualIndentation;
};

Rule.check = function(node, result) {

    this.result = result || {
        occurrences : []
    };

    node.children.forEach( child => this.check(child, this.result));

    const globalPos = node.getGlobalPos() - node.getIndentationSize();

    if (this.isBroken(node)) {
        this.add(
            node.getValue().trim(),
            node.getLineNumber() - 1,
            globalPos,
            node.getIndentationSize(),
            description
        );
    }

    return this.result;
};

module.exports = Rule;
