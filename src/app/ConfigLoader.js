const path      = require('path');
const Constants = require('./Constants');
const FileUtils = require('./FileUtils');

const ConfigLoader = {};

ConfigLoader.init = function(
    targetDir = Constants.clientAppDir,
    configFileName = Constants.clientConfigFileName
) {
    return createConfigFile(targetDir, configFileName);
};

ConfigLoader.load = function(configParam) {

    if (configParam) {
        this.config = configParam;
        return configParam;
    }

    if (this.config) {
        return this.config;
    }

    if (process.env.NODE_ENV === Constants.ENV_TEST) {
        return require(path.join(Constants.specDir, Constants.specConfigFileName));
    }

    if (!FileUtils.fileExists(Constants.configFilePath)) {
        this.init();
    }

    const config = require(Constants.configFilePath);

    addParamsToConfig(config);

    return config;
};

ConfigLoader.clear = function() {
    this.config = null;
};

const createConfigFile = (targetDir = Constants.configFilePath, configFileName) => {

    if (!FileUtils.fileExists(path.join(targetDir, configFileName))) {
        const configContent = {
            rules: {}
        };

        addDefaultRules(configContent);

        FileUtils.saveToJsonFile(targetDir, configFileName, configContent);

        return true;
    }

    return false;
};

const addParamsToConfig = config => {
    process.argv.forEach(val => {
        if (val === '--autofix') {
            config.autoFix = true;
        }
    });
};

function addDefaultRules(configContent) {

    const fs = require('fs');

    fs.readdirSync(Constants.lineByLineRulesDir)
        .forEach(addRuleTo(configContent));
    fs.readdirSync(Constants.treeRulesDir)
        .forEach(addRuleTo(configContent));
}

function addRuleTo(configContent) {
    return filename => {
        if (filename.endsWith('.js')) {
            const ruleName                = filename.slice(0, -3);
            configContent.rules[ruleName] = {};
        }
    };
}


module.exports = ConfigLoader;
