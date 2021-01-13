const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Tag attributes are not column-aligned';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.check = function(node, data) {

    const result2 = {
        occurrences : []
    };

    const childrenResult = this.checkChildren(node, data);

    result2.occurrences.push(...childrenResult.occurrences);

    const issetChildren    = getConsecutiveIssetTagChildren(node);
    const attrPosContainer = getCorrectAttributePositions(issetChildren);

    const a = this.checkAttributesAlignments(issetChildren, attrPosContainer);

    result2.occurrences.push(...a.occurrences);

    return result2;
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
    const result = {
        occurrences : []
    };
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

                result.occurrences.push(error);

                break;
            }
        }
    }

    return result;
};

module.exports = Rule;
