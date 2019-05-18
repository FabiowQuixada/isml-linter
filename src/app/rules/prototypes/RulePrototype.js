const ConfigUtils = require('../../util/ConfigUtils');

const RulePrototype = {

    init(name, description) {
        this.name        = name;
        this.description = description;
    },

    add(line, lineNumber, globalPos, length) {
        this.result.occurrences.push({
            line,
            globalPos,
            length,
            lineNumber : lineNumber + 1,
            rule       : this.name,
            message    : this.description
        });
    },

    isEnabled() {
        const config = ConfigUtils.load();
        return config && config.rules && this.name in config.rules;
    },

    isIgnore(templatePath) {
        const ignoreArray = this.getConfigs().ignore;

        if(ignoreArray) {
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

        return Object.assign(
            {},
            ruleDefaultConfigs,
            config.rules[this.name]
        );
    },
};

module.exports = RulePrototype;
