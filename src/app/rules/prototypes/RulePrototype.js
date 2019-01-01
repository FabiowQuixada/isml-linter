const config = require('./../../ConfigLoader').load();

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
};

module.exports = RulePrototype;
