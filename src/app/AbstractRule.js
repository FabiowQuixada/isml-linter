const config = require('./ConfigLoader').load();

class AbstractRule {

    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    isEnabled() {
        return config && config.enabledRules && this.name in config.enabledRules;
    }
}

module.exports = AbstractRule;
