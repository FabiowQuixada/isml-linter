const config = require('./../../ConfigLoader').load();

const RulePrototype = {

    init(name, description) {
        this.name = name;
        this.description = description;
    },

    add(line, lineNumber) {
        this.result.occurrences.push({
            line,
            lineNumber
        });
    },

    isEnabled() {
        return config && config.enabledRules && this.name in config.enabledRules;
    },
};

module.exports = RulePrototype;
