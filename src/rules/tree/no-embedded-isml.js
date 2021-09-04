const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Embedded ISML is not allowed';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    return node.isHtmlTag() &&
        !node.isOfType('is') &&
        node.head.indexOf('<isprint') === -1 &&
        node.head.indexOf('<is') >= 0;
};

module.exports = Rule;
