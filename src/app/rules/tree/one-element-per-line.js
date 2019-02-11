const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = 'Only one element per line is allowed';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(node) {
    return !node.isRoot() &&
        node.getLineNumber() === node.getParent().getLineNumber();
};

module.exports = Rule;
