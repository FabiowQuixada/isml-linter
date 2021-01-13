const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Tag attributes are not column-aligned';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.check = function(node, data) {

    const occurrences = [];

    const childrenOccurrences = this.checkChildren(node, data);

    occurrences.push(...childrenOccurrences);

    const issetChildren    = getConsecutiveIssetTagChildren(node);
    const attrPosContainer = getCorrectAttributePositions(issetChildren);

    const alignmentOccurrences = this.checkAttributesAlignments(issetChildren, attrPosContainer);

    occurrences.push(...alignmentOccurrences);

    return node.isRoot() ?
        { occurrences } :
        occurrences;
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
    const occurrences = [];

    for (const issetNode of issetChildren) {
        const attrArray = issetNode.getAttributeList();

        for (let i = 0; i < attrArray.length; i++) {
            const attr = attrArray[i];
            if (attr.localPos !== attrPosContainer[attr.name]) {
                const error = this.add(
                    issetNode.value.trim(),
                    issetNode.lineNumber - 1,
                    issetNode.globalPos,
                    issetNode.value.trim().length,
                    description
                );

                occurrences.push(error);
                break;
            }
        }
    }

    return occurrences;
};

module.exports = Rule;
