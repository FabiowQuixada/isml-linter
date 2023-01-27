const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const MaskUtils         = require('../../isml_tree/MaskUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Slash is not allowed for "iselse" nor "iselseif" tags';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    return (node.isOfType('iselse') || node.isOfType('iselseif')) &&
        node.head.trim().endsWith('/>');
};

Rule.getFixedContent = function(node) {
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        if (child.isOfType('iselse') || child.isOfType('iselseif')) {
            const slashPos = MaskUtils.maskInBetween(child.head, '${', '}').lastIndexOf('/');

            if (slashPos >= 0) {
                child.head = child.head.slice(0, slashPos) + child.head.slice(slashPos + 1);
            }
        }

        this.getFixedContent(child);
    }

    return node.toString();
};

module.exports = Rule;
