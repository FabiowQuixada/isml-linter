const config = require('./../../ConfigLoader').load();

const formattedLine = (line, lineNumber) => `Line ${lineNumber+1}: ${line.trim()}`;

const RulePrototype = {

    init(name, description) {
        this.name = name;
        this.description = description;
    },

    add(line, lineNumber) {
        this.result.occurrences.push(formattedLine(line, lineNumber));
    },

    isEnabled() {
        return config && config.enabledRules && this.name in config.enabledRules;
    },
};

module.exports = RulePrototype;
