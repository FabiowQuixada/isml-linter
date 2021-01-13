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

Rule.check = function(node, result = { occurrences : [] }, data) {

    const config = ConfigUtils.load();
    this.result  = result || {
        occurrences : []
    };

    this.checkChildren(node, result, data);

    const errorMessageList = this.isBroken(node);

    for (let i = 0; i < errorMessageList.length; i++) {
        this.add(
            node.value.trim(),
            node.lineNumber - 1,
            node.globalPos,
            node.value.trim().length,
            errorMessageList[i]
        );
    }

    if (this.result.occurrences.length &&
        config.autoFix &&
        this.getFixedContent &&
        node.isRoot()) {
        this.result.fixedContent = this.getFixedContent(node);
    }

    return this.result;
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
