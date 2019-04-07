const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = 'Hardcoded string is not allowed';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(node) {
    return !node.isRoot() &&
        !node.isMulticlause() &&
        !node.isTag() &&
        !node.isExpression() &&
        !node.isCommentContent();
};

module.exports = Rule;
