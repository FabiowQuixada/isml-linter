const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const Constants         = require('../../Constants');
const RuleUtils         = require('../../util/RuleUtils');

const TAG_TYPE    = 'iscontent';
const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = `<${TAG_TYPE}> tag should be the first in the template`;

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(node) {
    let rootNode = node;

    while (rootNode.getParent()) {
        rootNode = rootNode.getParent();
    }

    return node.isOfType(TAG_TYPE) &&
        rootNode.getChild(0).getId() !== node.getId();
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
