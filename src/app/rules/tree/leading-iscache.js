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

    while (rootNode.parent) {
        rootNode = rootNode.parent;
    }

    const isFirstNode          = rootNode.children[0] && rootNode.children[0].isOfType(TAG_TYPE);
    const isAfterIscontentNode = rootNode.children[0] && rootNode.children[0].isOfType('iscontent') &&
                                 rootNode.children[1] && rootNode.children[1].isOfType(TAG_TYPE);

    return node.isOfType(TAG_TYPE) &&
        (!isFirstNode && !isAfterIscontentNode);
};

Rule.getFixedContent = rootNode => {
    if (!RuleUtils.isTypeAmongTheFirstElements(rootNode, TAG_TYPE)) {
        const isContentNode = RuleUtils.findNodeOfType(rootNode, TAG_TYPE);

        if (isContentNode) {
            isContentNode.parent.removeChild(isContentNode);
            isContentNode.value = isContentNode.value.trim() + Constants.EOL;
            rootNode.addChildNodeToPos(isContentNode, 0);
        }
    }

    return rootNode.toString();
};

module.exports = Rule;
