const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const RuleUtils         = require('../../util/TempRuleUtils');
const Constants         = require('../../Constants');

const TAG_TYPE    = 'iscache';
const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = `<${TAG_TYPE}> tag should be on top of the template`;

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    const rootNode = node.getRoot();

    const isFirstNode          = rootNode.children[0] && rootNode.children[0].isOfType(TAG_TYPE);
    const isAfterIscontentNode = rootNode.children[0] && rootNode.children[0].isOfType('iscontent') &&
                                 rootNode.children[1] && rootNode.children[1].isOfType(TAG_TYPE);

    return node.isOfType(TAG_TYPE) &&
        (!isFirstNode && !isAfterIscontentNode);
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
