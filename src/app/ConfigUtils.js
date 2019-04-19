const path      = require('path');
const Constants = require('./Constants');
const FileUtils = require('./FileUtils');

const ConfigUtils = {};

ConfigUtils.init = function(
    targetDir = Constants.clientAppDir,
    configFileName = Constants.clientConfigFileName
) {
    return createConfigFile(targetDir, configFileName);
};

ConfigUtils.load = function(configParam) {

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

ConfigUtils.clear = function() {
    this.config = null;
};

const createConfigFile = (targetDir = Constants.configFilePath, configFileName) => {

    if (!FileUtils.fileExists(path.join(targetDir, configFileName))) {
        const configContent = {
            rules: {}
        };

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

module.exports = ConfigUtils;
