const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = '<iscontent> tag should be the first in the template';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(node) {
    let rootNode = node;

    while (rootNode.getParent()) {
        rootNode = rootNode.getParent();
    }

    return node.isOfType('iscontent') &&
        rootNode.getChild(0).getId() !== node.getId();
};

module.exports = Rule;
