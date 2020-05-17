const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const SfccTags          = require('../../enums/SfccTags');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Embedded ISML is not allowed';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    if (!node.isIsmlTag() || node.isCustomIsmlTag()) {
        return false;
    }

    const attrList   = node.getAttributeList();
    const nodeType   = node.getType();
    const sfccTagObj = SfccTags[nodeType];
    let result       = null;

    attrList.some( nodeAttribute => {
        const sfccAttr = sfccTagObj.attributes[nodeAttribute.name];
        result         = checkForExclusiveAttributes(sfccTagObj, nodeAttribute, attrList) ||
                         checkForConditionalAttributes(sfccAttr, nodeAttribute, attrList);

        return !result;
    });

    if (sfccTagObj.requires) {
        const exclusiveAttributeList = sfccTagObj.requires.exclusive;
        if (attrList.length === 0 && exclusiveAttributeList.length > 1) {
            result         = {};
            result.message = `The "${node.getType()}" tag needs to have either "${exclusiveAttributeList[0]}" or "${exclusiveAttributeList[1]}" attribute`;
        }
    }

    return result;
};

const checkForExclusiveAttributes = (sfccTagObj, nodeAttribute, attrList) => {
    let result = null;
    if (sfccTagObj && sfccTagObj.requires && sfccTagObj.requires.exclusive) {
        const exclusiveAttributeObj          = sfccTagObj.requires.exclusive;
        const exclusiveAttributesOccurrences = [];

        for (let i = 0; i < attrList.length; i++) {
            const attr = attrList[i];
            if (exclusiveAttributeObj.indexOf(attr.name) !== -1) {
                exclusiveAttributesOccurrences.push(attr.name);
            }
        }

        if (exclusiveAttributesOccurrences.length > 1) {
            result         = {};
            result.message = `The "${nodeAttribute.node.getType()}" tag cannot have "${exclusiveAttributesOccurrences[0]}" and "${exclusiveAttributesOccurrences[1]}" attributes simultaneously`;
        }

    }

    return result;
};

const checkForConditionalAttributes = (sfccAttr, nodeAttribute, attrList) => {
    const requiredAttributeObj = sfccAttr.requires;
    let result                 = null;

    if (requiredAttributeObj) {
        const requiredAttributeName   = requiredAttributeObj.name;
        const requiredAttributeValues = requiredAttributeObj.ifValues;
        const isConditionFulfilled    = requiredAttributeValues.indexOf(nodeAttribute.value) !== -1;
        const hasRequiredAttr         = attrList.some( attr => attr.name === requiredAttributeName );

        if (isConditionFulfilled && !hasRequiredAttr) {
            result         = nodeAttribute;
            result.message = `"${requiredAttributeObj.name}" attribute is expected when "${nodeAttribute.name}" attribute has value of "${nodeAttribute.value}"`;
        }
    }

    return result;
};

Rule.check = function(node, result) {

    this.result = result || {
        occurrences : []
    };

    for (let i = 0; i < node.children.length; i++) {
        this.check(node.children[i], this.result);
    }

    const occurrence = this.isBroken(node);
    if (occurrence) {
        this.add(
            node.value.trim(),
            node.lineNumber - 1,
            node.globalPos,
            node.value.trim().length,
            occurrence.message
        );
    }

    return this.result;
};

module.exports = Rule;
