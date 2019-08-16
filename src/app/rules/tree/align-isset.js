const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Tag attributes are not column-aligned';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.check = function(node, result) {

    this.result = result || {
        occurrences : []
    };

    for (let i = 0; i < node.children.length; i++) {
        this.check(node.children[i], this.result);
    }

    const issetChildren    = getConsecutiveIssetTagChildren(node);
    const attrPosContainer = getCorrectAttributePositions(issetChildren);

    this.checkAttributesAlignments(issetChildren, attrPosContainer);

    return this.result;
};

const getConsecutiveIssetTagChildren = node => {
    const issetChildren = new Set();

    for (let i = 1; i < node.children.length; i++) {
        const prevChild = node.children[i - 1];
        const child     = node.children[i];

        if (prevChild.isOfType('isset') && child.isOfType('isset')) {
            issetChildren.add(prevChild);
            issetChildren.add(child);
        } else if (!child.isOfType('isset') && issetChildren.length > 0) {
            break;
        }
    }

    return issetChildren;
};

const getCorrectAttributePositions = issetChildren => {

    const attrPosContainer = {};
    for (const issetNode of issetChildren) {

        const attrArray = issetNode.getAttributeList();
        for (let i = 0; i < attrArray.length; i++) {

            const attr = attrArray[i];
            if (!attrPosContainer[attr.name] || attr.localPos > attrPosContainer[attr.name]) {
                attrPosContainer[attr.name] = attr.localPos;
            }
        }
    }

    return attrPosContainer;
};

Rule.checkAttributesAlignments = function(issetChildren, attrPosContainer) {
    for (const issetNode of issetChildren) {
        const attrArray = issetNode.getAttributeList();

        for (let i = 0; i < attrArray.length; i++) {
            const attr = attrArray[i];
            if (attr.localPos !== attrPosContainer[attr.name]) {
                this.add(
                    issetNode.value.trim(),
                    issetNode.lineNumber - 1,
                    issetNode.globalPos,
                    issetNode.value.trim().length,
                    description
                );
                break;
            }
        }
    }
};

module.exports = Rule;
