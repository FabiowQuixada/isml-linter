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

const isConfigSet = () => configData !== null;

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

        ConsoleUtils.displayConfigError();
        throw ExceptionUtils.noEslintConfigError();
    }

    const eslintConfig = JSON.parse(fs.readFileSync(Constants.eslintConfigFilePath));

    return eslintConfig;
};

const clearConfig = () => {
    configData = null;
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
        FileUtils.fileExists(Constants.eslintConfigFileName);
};

const isTestEnv = () => process.env.NODE_ENV === Constants.ENV_TEST;

const setLocalConfig = () => {
    if (isTestEnv()) {
        return;
    }

    try {
        configData = require(Constants.configPreferredFilePath);
    }
    catch (err) {
        configData = require(Constants.configFilePath);
    }
};

module.exports.init             = init;
module.exports.setLocalConfig   = setLocalConfig;
module.exports.load             = load;
module.exports.loadEslintConfig = loadEslintConfig;
module.exports.clearConfig      = clearConfig;
module.exports.isConfigSet      = isConfigSet;
