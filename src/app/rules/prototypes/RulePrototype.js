const config = require('./../../ConfigLoader').load();

const RulePrototype = {

    init(name, description) {
        this.name = name;
        this.description = description;
    },

    isEnabled() {
        return config && config.enabledRules && this.name in config.enabledRules;
    },

    getProcessedFilePath(fileName) {
        return fileName.substring(fileName.indexOf('default') + 8);
    }
}

module.exports = RulePrototype;
