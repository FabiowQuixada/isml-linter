const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const RuleUtils         = require('../../util/RuleUtils');
const Constants         = require('../../Constants');

const TAG_TYPE    = 'iscache';
const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = `<${TAG_TYPE}> tag should be on top of the template`;

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(node) {
    let rootNode = node;

    while (rootNode.getParent()) {
        rootNode = rootNode.getParent();
    }

    const isFirstNode          = rootNode.getChild(0) && rootNode.getChild(0).isOfType(TAG_TYPE);
    const isAfterIscontentNode = rootNode.getChild(0) && rootNode.getChild(0).isOfType('iscontent') &&
                                 rootNode.getChild(1) && rootNode.getChild(1).isOfType(TAG_TYPE);

    return node.isOfType(TAG_TYPE) &&
        (!isFirstNode && !isAfterIscontentNode);
};

Rule.getFixedContent = rootNode => {
    if (!RuleUtils.isTypeAmongTheFirstElements(rootNode, TAG_TYPE)) {
        const isContentNode = RuleUtils.findNodeOfType(rootNode, TAG_TYPE);

        if (isContentNode) {
            isContentNode.getParent().removeChild(isContentNode);
            isContentNode.setValue(isContentNode.getValue().trim() + Constants.EOL);
            rootNode.addChildNodeToPos(isContentNode, 0);
        }
    }

    return rootNode.toString();
};

module.exports = Rule;
