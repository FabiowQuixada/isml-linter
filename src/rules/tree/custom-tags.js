const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const CustomTags        = require('../../util/CustomTagUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Invalid custom tag';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.addError = function(node, message) {
    this.add(
        node.value.trim(),
        node.lineNumber - 1,
        node.globalPos,
        node.value.trim().length,
        message
    );
};

Rule.check = function(node, result, data) {

    this.result             = this.result || {};
    this.result.occurrences = result.occurrences || [];

    for (let i = 0; i < node.children.length; i++) {
        this.check(node.children[i], this.result, data);
    }

    if (data) {
        const isUsedButNotDeclared = !data.moduleDefinition && data.customModuleArray && data.customModuleArray.length > 0;

        if (node.value.indexOf('template="util/modules"') !== -1) {
            const isUnnecessaryDefinition = data.moduleDefinition && !data.customModuleArray;

            if (isUnnecessaryDefinition) {
                this.addError(node, 'Unnecessary inclusion of the modules template');
            }
        }

        if (isUsedButNotDeclared && node.isCustomIsmlTag()) {
            this.addError(node,
                CustomTags[node.getType()] ?
                    `Custom tag "${node.getType()}" could not be identified. Maybe you forgot to include the modules template?` :
                    `Unknown tag "${node.getType()}". Maybe you forgot to add it to util/modules template?`
            );
        }
    }

    return this.result;
};

module.exports = Rule;
