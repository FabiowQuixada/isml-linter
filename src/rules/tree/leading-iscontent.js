const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const Constants         = require('../../Constants');
const RuleUtils         = require('../../util/TempRuleUtils');

const TAG_TYPE    = 'iscontent';
const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = `<${TAG_TYPE}> tag should be the first in the template`;

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    const rootNode = node.getRoot();

    return node.isOfType(TAG_TYPE) &&
        rootNode.children[0].id !== node.id;
};

Rule.getFixedContent = function(rootNode) {
    if (!RuleUtils.isTypeAmongTheFirstElements(rootNode, TAG_TYPE)) {
        const isContentNode = RuleUtils.findNodeOfType(rootNode, TAG_TYPE);

        if (isContentNode) {
            isContentNode.parent.removeChild(isContentNode);
            isContentNode.head = isContentNode.head.trim() + Constants.EOL;
            rootNode.addChildNodeToPos(isContentNode, 0);
        }
    }

    return rootNode.toString();
};

Rule.fixContent = function(rootNode) {
    return {
        rootNode,
        fixedContent : this.getFixedContent(rootNode)
    };
};

module.exports = Rule;
