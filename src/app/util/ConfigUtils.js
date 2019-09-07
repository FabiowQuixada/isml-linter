const fs        = require('fs');
const path      = require('path');
const Constants = require('../Constants');
const FileUtils = require('./FileUtils');

let configData       = null;
let eslintConfigData = null;

const init = (
    targetDir = Constants.clientAppDir,
    configFileName = Constants.configPreferredFileName
) => {
    return createConfigFile(targetDir, configFileName);
};

const isConfigSet       = () => configData !== null;
const isEslintConfigSet = () => eslintConfigData !== null;

const load = configParam => {

    if (configParam) {
        configData = configParam;
        return configParam;
    }

    if (configData) {
        return configData;
    }

    if (isTestEnv()) {
        configData = require(path.join('..', '..', '..', 'spec', Constants.configPreferredFileName));
        return configData;
    }

    if (!existConfigFile()) {
        const ConsoleUtils   = require('./ConsoleUtils');
        const ExceptionUtils = require('./ExceptionUtils');

        ConsoleUtils.displayConfigError();
        throw ExceptionUtils.noConfigError();
    }

    setLocalConfig();

    addParamsToConfig(configData);

    return configData;
};

const loadEslintConfig = eslintConfigParam => {

    if (eslintConfigParam) {
        eslintConfigData = eslintConfigParam;
        return eslintConfigParam;
    }

    if (eslintConfigData) {
        return eslintConfigData;
    }

    if (isTestEnv()) {
        return require(path.join('..', '..', '..', 'spec', Constants.eslintConfigFileName));
    }

    if (!existEslintConfigFile()) {
        const ConsoleUtils   = require('./ConsoleUtils');
        const ExceptionUtils = require('./ExceptionUtils');

        ConsoleUtils.displayEslintConfigError();
        throw ExceptionUtils.noEslintConfigError();
    }

    let eslintConfig = null;

    try {
        eslintConfig = JSON.parse(fs.readFileSync(Constants.eslintConfigFilePath));
    } catch (err) {
        eslintConfig = JSON.parse(fs.readFileSync(Constants.eslintConfigFilePath2));
    }

    return eslintConfig;
};

const clearConfig = () => {
    configData = null;
};

const clearEslintConfig = () => {
    eslintConfigData = null;
};

const createConfigFile = (
    targetDir = Constants.configFilePath,
    configFileName) => {

    if (!existConfigFile()) {
        const sourceDir = 'scaffold_files';

        fs.copyFileSync(
            path.join('node_modules', 'isml-linter', sourceDir, configFileName),
            path.join(targetDir, configFileName));

        return true;
    }

    return false;
};

const addParamsToConfig = config => {
    for (let i = 0; i < process.argv.length; i++) {
        if (process.argv[i] === '--autofix') {
            config.autoFix = true;
        }
    }
};

const existConfigFile = () => {
    return configData ||
        FileUtils.fileExists(Constants.configFilePath) ||
        FileUtils.fileExists(Constants.configPreferredFilePath);
};

const existEslintConfigFile = () => {
    return eslintConfigData ||
        configData && configData.eslintConfig && FileUtils.fileExists(configData.eslintConfig) ||
        FileUtils.fileExists(Constants.eslintConfigFileName) ||
        FileUtils.fileExists(Constants.eslintConfigFileName2);
};

const isTestEnv = () => process.env.NODE_ENV === Constants.ENV_TEST;

const setLocalConfig = () => {
    if (isTestEnv()) {
        return;
    }

    // TODO: Find a better way of checking this;
    try {
        configData = require(Constants.configPreferredFilePath);
    }
    catch (err) {
        try {
            configData = require(Constants.configFilePath);
        } catch (err) {
            // Configuration will be loaded through setConfig() method;
        }
    }
};

const setLocalEslintConfig = () => {
    try {
        // TODO: Find a better way to do this;
        if (configData && configData.eslintConfig) {
            if (FileUtils.fileExists(configData.eslintConfig)) {
                eslintConfigData = require(path.join(Constants.clientAppDir, configData.eslintConfig));
            }
        } else {
            try {
                eslintConfigData = require(Constants.eslintConfigFilePath);
            } catch (err) {
                eslintConfigData = require(Constants.eslintConfigFilePath2);
            }
        }
    } catch (err) {
        // Configuration will be loaded through setConfig() method;
    }
};

module.exports.init                 = init;
module.exports.setLocalConfig       = setLocalConfig;
module.exports.setLocalEslintConfig = setLocalEslintConfig;
module.exports.load                 = load;
module.exports.loadEslintConfig     = loadEslintConfig;
module.exports.clearConfig          = clearConfig;
module.exports.clearEslintConfig    = clearEslintConfig;
module.exports.isConfigSet          = isConfigSet;
module.exports.isEslintConfigSet    = isEslintConfigSet;
