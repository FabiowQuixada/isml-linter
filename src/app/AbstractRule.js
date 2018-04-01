const config = require('./ConfigLoader').load();

class AbstractRule {

    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    isEnabled() {
        return config && config.enabledRules && config.enabledRules.indexOf(this.name) !== -1;
    }
}

module.exports = AbstractRule;
