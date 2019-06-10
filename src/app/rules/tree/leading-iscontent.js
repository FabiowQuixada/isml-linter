const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const Constants         = require('../../Constants');

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

Rule.getFixedContent = rootNode => {
    if (!isIsContentAmongTheFirstElements(rootNode)) {
        const isContentNode = findIsContentNode(rootNode);

        if (isContentNode) {
            isContentNode.getParent().removeChild(isContentNode);
            isContentNode.setValue(isContentNode.getValue().trim() + '\n');
            rootNode.addChildNodeToPos(isContentNode, 0);
        }
    }

    return rootNode.toString();
};

const isIsContentAmongTheFirstElements = rootNode => {
    let result = false;

    for (let i = 0; i < Constants.leadingElementsChecking; i++) {
        result = result ||
            rootNode.getChild(i) &&
            rootNode.getChild(i).isOfType('iscontent');
    }

    return result;
};

const findIsContentNode = node => {
    let result = null;

    node.getChildren().some( child => {
        if (child.isOfType('iscontent')) {
            result = child;
            return true;
        } else {
            result = findIsContentNode(child) || result;
        }

        return false;
    });

    return result;
};

module.exports = Rule;
