const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const CustomTags        = require('../../util/CustomTagUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Invalid custom tag';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.addError = function(node, message) {
    return this.add(
        node.value.trim(),
        node.lineNumber - 1,
        node.globalPos,
        node.value.trim().length,
        message
    );
};

Rule.check = function(node, result, data) {

    const result2 = {
        occurrences : []
    };

    const childrenResult = this.checkChildren(node, result2, data);

    if (childrenResult) {
        result2.occurrences.push(...childrenResult.occurrences);
    }

    if (data) {
        const isUsedButNotDeclared = !data.moduleDefinition && data.customModuleArray && data.customModuleArray.length > 0;

        if (node.value.indexOf('template="util/modules"') !== -1) {
            const isUnnecessaryDefinition = data.moduleDefinition && !data.customModuleArray;

            if (isUnnecessaryDefinition) {
                const error = this.addError(node, 'Unnecessary inclusion of the modules template');
                result2.occurrences.push(error);
            }
        }

        if (isUsedButNotDeclared && node.isCustomIsmlTag()) {
            const error = this.addError(node,
                CustomTags[node.getType()] ?
                    `Custom tag "${node.getType()}" could not be identified. Maybe you forgot to include the modules template?` :
                    `Unknown tag "${node.getType()}". Maybe you forgot to add it to util/modules template?`
            );

            result2.occurrences.push(error);
        }
    }

    return result2;
};

module.exports = Rule;
