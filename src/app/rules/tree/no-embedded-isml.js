const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Embedded ISML is not allowed';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    return node.isHtmlTag() &&
        !node.isOfType('is') &&
        node.value.indexOf('<isprint') === -1 &&
        node.value.indexOf('<is') !== -1;
};

module.exports = Rule;
