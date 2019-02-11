const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = 'Embedded ISML is not allowed';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(node) {
    return node.isHtmlTag() &&
        !node.isOfType('is') &&
        node.getValue().indexOf('<isprint') === -1 &&
        node.getValue().indexOf('<is') !== -1;
};

module.exports = Rule;
