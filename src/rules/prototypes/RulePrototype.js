const ConfigUtils  = require('../../util/ConfigUtils');
const GeneralUtils = require('../../util/GeneralUtils');
const Constants    = require('../../Constants');

const RulePrototype = {

    init(id, description) {
        this.id          = id;
        this.description = description;
        this.level       = 'errors';
        this.result      = {
            occurrenceList : []
        };
    },

    getError(line, lineNumber, columnNumber, globalPos, length, description) {
        return {
            line,
            globalPos,
            length,
            lineNumber,
            columnNumber,
            rule       : this.id,
            level      : this.getConfigs().level || Constants.occurrenceLevels.ERROR,
            message    : description || this.description
        };
    },

    isEnabled() {
        const config = ConfigUtils.load();
        return config && config.rules && this.id in config.rules;
    },

    shouldIgnore(templatePath) {
        const ignoreArray       = this.getConfigs().ignore;
        const formattedFilePath = templatePath.replaceAll('\\', '/');

        if (ignoreArray) {
            return ignoreArray.some( ignore => {
                return formattedFilePath.includes(ignore);
            });
        }

        return false;
    },

    getDefaultAttrs() {
        return {};
    },

    getConfigs() {
        const config             = ConfigUtils.load();
        const ruleDefaultConfigs = this.getDefaultAttrs();
        const indentRuleValue    = config.rules['indent'] && config.rules['indent'].value;

        return {
            ...ruleDefaultConfigs,
            ...config.rules[this.id],
            autoFix        : config.autoFix,
            indent         : indentRuleValue || 4,
            linebreakStyle : GeneralUtils.getActiveLineBreak()
        };
    },

    checkChildren(node, data) {
        const occurrenceList = [];

        for (let i = 0; i < node.children.length; i++) {
            const childrenOccurrenceList = this.check(node.children[i], data);

            if (childrenOccurrenceList) {
                occurrenceList.push(...childrenOccurrenceList);
            }
        }

        return occurrenceList;
    }
};

module.exports = RulePrototype;
