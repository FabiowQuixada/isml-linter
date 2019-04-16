const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ParseUtils        = require('../../isml_tree/components/ParseUtils');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = 'Line incorrectly indented';

const Rule = Object.create(TreeRulePrototype);

const getActualIndentationSize = node => {
    const firstNonEmptyCharPos = ParseUtils.getNextNonEmptyCharPos(node.getValue()) - 1;
    const sub                  = node.getValue().substring(0, firstNonEmptyCharPos);
    const sub2                 = sub.lastIndexOf('\n');
    const actualIndentation    = sub.substring(sub2, firstNonEmptyCharPos).length;

    return actualIndentation;
};

Rule.init(ruleName, description);

Rule.getDefaultAttrs = () => {
    return {
        size: 4
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

    const configIndentSize     = this.getConfigs().size;
    const expectedIndentation  = (node.getDepth() - 1) * configIndentSize;
    const actualIndentation    = getActualIndentationSize(node);
    const isInSameLineAsParent = node.getParent() && node.getParent().getLineNumber() === node.getLineNumber();

    return !node.isRoot() &&
        !isInSameLineAsParent &&
        expectedIndentation !== actualIndentation;
};

Rule.check = function(node, result) {

    const that  = this;
    this.result = result || {
        occurrences: []
    };

    node.children.forEach( child => this.check(child, this.result));

    if (this.isBroken(node)) {
        that.add(
            node.getValue().trim(),
            node.getLineNumber() - 1,
            0,
            getActualIndentationSize(node)
        );
    }

    return this.result;
};

module.exports = Rule;
