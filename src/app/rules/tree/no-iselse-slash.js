const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Non slash is allowed for "iselse" tags';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    return (node.isOfType('iselse') || node.isOfType('iselseif')) &&
        node.value.trim().endsWith('/>');
};

module.exports = Rule;
