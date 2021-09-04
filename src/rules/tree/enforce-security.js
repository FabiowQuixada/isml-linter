const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ConfigUtils       = require('../../util/ConfigUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'This code introduces a security risk';

const Rule = Object.create(TreeRulePrototype);

// Rule options;
const REVERSE_TABNABBING = 'prevent-reverse-tabnabbing';

Rule.init(ruleId, description);

Rule.getDefaultAttrs = () => {
    const result = {};

    result[REVERSE_TABNABBING] = true;

    return result;
};

Rule.isBroken = function(node) {
    const config    = this.getConfigs();
    const errorList = [];

    if (config[REVERSE_TABNABBING]) {
        const tabNabbingResult = checkReverseTabNabbing(node);

        if (tabNabbingResult) {
            errorList.push(tabNabbingResult);
        }
    }

    return errorList;
};

Rule.check = function(node, data) {

    const config           = ConfigUtils.load();
    const occurrenceList   = this.checkChildren(node, data);
    const errorMessageList = this.isBroken(node);

    for (let i = 0; i < errorMessageList.length; i++) {
        const error = this.getError(
            node.head.trim(),
            node.lineNumber,
            node.columnNumber,
            node.globalPos,
            node.head.trim().length,
            errorMessageList[i]
        );

        occurrenceList.push(error);
    }

    return this.return(node, occurrenceList, config);
};

const checkReverseTabNabbing = node => {
    if (node.isOfType('a')) {
        const attributeList         = node.getAttributeList();
        let hasTargetBlankAttribute = false;
        let hasRelNoOpenerAttribute = false;

        for (let i = 0; i < attributeList.length; i++) {
            const attribute = attributeList[i];

            if (attribute.name === 'target' && attribute.value === '_blank') {
                hasTargetBlankAttribute = true;
            }

            if (attribute.name === 'rel' && attribute.value.indexOf('noopener') >= 0) {
                hasRelNoOpenerAttribute = true;
            }
        }

        if (hasTargetBlankAttribute && !hasRelNoOpenerAttribute) {
            return 'Potential reverse tabnabbing security hole detected. Consider adding \'rel="noopener"\'';
        }
    }

    return null;
};

module.exports = Rule;
