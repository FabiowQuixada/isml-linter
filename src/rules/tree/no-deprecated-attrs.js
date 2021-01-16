const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const SfccTags          = require('../../enums/SfccTags');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Attribute label or value is deprecated';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    if (!node.isIsmlTag()) {
        return false;
    }

    const attrList = node.getAttributeList();
    const nodeType = node.getType();
    const obj      = SfccTags[nodeType];
    let result     = null;

    if (node.isStandardIsmlTag()) {
        attrList.some( nodeAttribute => {
            for (const sfccAttr in obj.attributes) {
                if (Object.prototype.hasOwnProperty.call(obj.attributes, sfccAttr) && nodeAttribute.name === sfccAttr) {
                    const attr              = obj.attributes[sfccAttr];
                    const isValueDeprecated = attr.deprecatedValues &&
                    attr.deprecatedValues.indexOf(nodeAttribute.value) !== -1;

                    if (isValueDeprecated) {
                        result         = nodeAttribute;
                        result.message = `"${nodeAttribute.value}" value is deprecated for "${nodeAttribute.name}" attribute`;
                        return true;
                    }
                }
            }

            return false;
        });
    }

    return result;
};

Rule.check = function(node, data) {

    const occurrenceList = this.checkChildren(node, data);

    const occurrence = this.isBroken(node);
    if (occurrence) {
        const error = this.getError(
            node.value.trim(),
            node.lineNumber - 1,
            occurrence.attrGlobalPos,
            occurrence.attrFullLength,
            occurrence.message
        );

        occurrenceList.push(error);
    }

    return node.isRoot() ?
        { occurrenceList } :
        occurrenceList;
};

module.exports = Rule;
