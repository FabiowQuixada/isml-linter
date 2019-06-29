const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = 'Non slash is allowed for "iselse" tags';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(node) {
    return (node.isOfType('iselse') || node.isOfType('iselseif')) &&
        node.getValue().trim().endsWith('/>');
};

module.exports = Rule;
