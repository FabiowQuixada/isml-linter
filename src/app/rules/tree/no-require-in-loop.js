const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = '"require()" call is not allowed within a loop';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(node) {

    if (node.getValue().indexOf('require(') === -1) {
        return false;
    }

    let iterator = node;

    while (iterator.getParent()) {
        iterator = iterator.getParent();

        if (iterator.isOfType('isloop')) {
            return true;
        }
    }

    return false;
};

module.exports = Rule;
