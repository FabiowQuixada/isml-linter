const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Hardcoded string is not allowed';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    return !node.isRoot() &&
    !node.parent.isOfType('script') &&
        node.value.trim() &&
        !node.isRoot() &&
        !node.isMulticlause() &&
        !node.isTag() &&
        !node.isScriptContent() &&
        !node.isExpression() &&
        !node.isCommentContent();
};

module.exports = Rule;
