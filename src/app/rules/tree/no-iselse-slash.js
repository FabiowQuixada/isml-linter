const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const MaskUtils         = require('../../isml_tree/MaskUtils');
const GeneralUtils      = require('../../util/GeneralUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Non slash is allowed for "iselse" tags';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    return (node.isOfType('iselse') || node.isOfType('iselseif')) &&
        node.value.trim().endsWith('/>');
};

Rule.getFixedContent = function(node) {
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        if (child.isOfType('iselse') || child.isOfType('iselseif')) {
            const slashPos = MaskUtils.maskIgnorableContent(child.value).lastIndexOf('/');

            if (slashPos !== -1) {
                child.value = child.value.slice(0, slashPos) + child.value.slice(slashPos + 1);
            }
        }

        this.getFixedContent(child);
    }

    return GeneralUtils.applyActiveLinebreaks(node.toString());
};

module.exports = Rule;
