const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = 'max depth beyond allowed';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(node) {
    const configMaxDepth = this.getConfigs().value;
    return node.getHeight() > configMaxDepth;
};

module.exports = Rule;
