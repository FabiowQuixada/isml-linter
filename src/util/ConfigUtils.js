const fs        = require('fs');
const path      = require('path');
const Constants = require('../Constants');
const FileUtils = require('./FileUtils');

let configData       = null;
let eslintConfigData = null;

const init = (
    targetDir = Constants.clientAppDir,
    configFileName = Constants.configFileNameList[0]
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
        configData = require(path.join('..', '..', 'spec', Constants.configFileNameList[0]));
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

    setLocalEslintConfig();

    return eslintConfigData;
};

const clearConfig = () => {
    configData = null;
};

const clearEslintConfig = () => {
    eslintConfigData = null;
};

const createConfigFile = (
    targetDir = Constants.configFilePathList[0],
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
        FileUtils.fileExists(Constants.configFilePathList[0]) ||
        FileUtils.fileExists(Constants.configFilePathList[1]);
};

const getConfigFilePath = () => {
    for (let index = 0; index < Constants.configFilePathList.length; index++) {
        const configPath = Constants.configFilePathList[index];

        if (FileUtils.fileExists(configPath)) {
            return configPath;
        }
    }

    return null;
};

const existEslintConfigFile = () => {
    return eslintConfigData ||
        configData && configData.eslintConfig && FileUtils.fileExists(configData.eslintConfig) ||
        FileUtils.fileExists(Constants.eslintConfigFilePathList[0]) ||
        FileUtils.fileExists(Constants.eslintConfigFilePathList[1]) ||
        FileUtils.fileExists(Constants.eslintConfigFilePathList[2]);
};

const isTestEnv = () => process.env.NODE_ENV === Constants.ENV_TEST;

const setLocalConfig = () => {
    if (isTestEnv()) {
        return;
    }

    for (let i = 0; i < Constants.configFilePathList.length; i++) {
        const configFilePath = Constants.configFilePathList[i];
        if (FileUtils.fileExists(configFilePath)) {
            configData = require(configFilePath);
            break;
        }
    }
};

const setLocalEslintConfig = () => {
    try {
        if (configData && configData.eslintConfig) {
            if (FileUtils.fileExists(configData.eslintConfig)) {
                eslintConfigData = require(path.join(Constants.clientAppDir, configData.eslintConfig));
            }
        } else {
            for (let i = 0; i < Constants.eslintConfigFilePathList.length; i++) {
                const configFilePath = Constants.eslintConfigFilePathList[i];
                if (FileUtils.fileExists(configFilePath)) {
                    eslintConfigData = configFilePath.endsWith('.eslintrc') ?
                        JSON.parse(fs.readFileSync(configFilePath).toString()) :
                        require(configFilePath);

                    break;
                }
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
module.exports.getConfigFilePath    = getConfigFilePath;
