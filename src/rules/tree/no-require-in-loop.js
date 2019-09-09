const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = '"require()" call is not allowed within a loop';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {

    if (node.value.indexOf('require(') === -1) {
        return false;
    }

    let iterator = node;

    while (iterator.parent) {
        iterator = iterator.parent;

        if (iterator.isOfType('isloop')) {
            return true;
        }
    }

    return false;
};

module.exports = Rule;
