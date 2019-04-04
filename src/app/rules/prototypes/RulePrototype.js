const config    = require('./../../ConfigLoader').load();
const Constants = require('../../Constants');

const RulePrototype = {

    init(name, description) {
        this.name        = name;
        this.description = description;
    },

    add(line, lineNumber, columnStart, length) {
        this.result.occurrences.push({
            line,
            lineNumber : lineNumber + 1,
            columnStart,
            length
        });
    },

    isEnabled() {
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

    getConfigs() {
        if (config && config.rules && config.rules[this.name]) {
            return config.rules[this.name];
        }

        return Constants.rules[this.name];
    },
};

module.exports = RulePrototype;
