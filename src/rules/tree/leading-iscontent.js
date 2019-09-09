const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const Constants         = require('../../Constants');
const RuleUtils         = require('../../util/TempRuleUtils');
const GeneralUtils      = require('../../util/GeneralUtils');

const TAG_TYPE    = 'iscontent';
const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = `<${TAG_TYPE}> tag should be the first in the template`;

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    let rootNode = node;

    while (rootNode.parent) {
        rootNode = rootNode.parent;
    }

    return node.isOfType(TAG_TYPE) &&
        rootNode.children[0].id !== node.id;
};

Rule.getFixedContent = function(rootNode) {
    if (!RuleUtils.isTypeAmongTheFirstElements(rootNode, TAG_TYPE)) {
        const isContentNode = RuleUtils.findNodeOfType(rootNode, TAG_TYPE);

        if (isContentNode) {
            isContentNode.parent.removeChild(isContentNode);
            isContentNode.value = isContentNode.value.trim() + Constants.EOL;
            rootNode.addChildNodeToPos(isContentNode, 0);
        }
    }

    return GeneralUtils.applyActiveLinebreaks(rootNode.toString());
};

module.exports = Rule;
