const path      = require('path');
const Constants = require('./Constants');
const FileUtils = require('./FileUtils');

const loadCurrentEnvConfigurationFile = () => {

    if (process.env.NODE_ENV === Constants.ENV_TEST) {
        return require(path.join(Constants.specDir, Constants.specConfigFileName));
    }

    if (!FileUtils.fileExists(Constants.configFilePath)) {
        init();
    }

    const config = require(Constants.configFilePath);

    addParamsToConfig(config);

    return config;
};

const createClientDirectories = dir => {
    FileUtils.createDirIfDoesNotExist(dir);
    FileUtils.createClientDir('output', dir);
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

const init = (
    targetDir = Constants.clientAppDir,
    configFileName = Constants.clientConfigFileName
) => {

    createClientDirectories(targetDir);
    return createConfigFile(targetDir, configFileName);
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

module.exports = {
    init,
    load: loadCurrentEnvConfigurationFile
};
