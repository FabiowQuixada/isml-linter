const ConfigUtils  = require('../../util/ConfigUtils');
const GeneralUtils = require('../../util/GeneralUtils');
const Constants    = require('../../Constants');

const RulePrototype = {

    init(id, description) {
        this.id          = id;
        this.description = description;
        this.level       = 'errors';
        this.result      = {
            occurrences : []
        };
    },

    add(line, lineNumber, globalPos, length, description) {
        return {
            line,
            globalPos,
            length,
            lineNumber : lineNumber + 1,
            rule       : this.id,
            level      : this.getConfigs().level || Constants.occurrenceLevels.ERROR,
            message    : description || this.description
        };
    },

    isEnabled() {
        const config = ConfigUtils.load();
        return config && config.rules && this.id in config.rules;
    },

    isIgnore(templatePath) {
        const ignoreArray = this.getConfigs().ignore;

        if (ignoreArray) {
            return ignoreArray.some( ignore => {
                return templatePath.includes(ignore);
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

        return {
            ...ruleDefaultConfigs,
            ...config.rules[this.id],
            autoFix        : config.autoFix,
            indent         : config.indent || 4,
            linebreakStyle : GeneralUtils.getActiveLinebreak()
        };
    },

    checkChildren(node, result, data) {
        const result2 = {
            occurrences : []
        };

        for (let i = 0; i < node.children.length; i++) {
            const childResult = this.check(node.children[i], result2, data);

            if (childResult) {
                result2.occurrences.push(...childResult.occurrences);
            }
        }

        return result2;
    }
};

module.exports = RulePrototype;
