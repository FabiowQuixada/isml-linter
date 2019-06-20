const fs        = require('fs');
const path      = require('path');
const Constants = require('../Constants');
const FileUtils = require('./FileUtils');

let configData = null;

const init = (
    targetDir = Constants.clientAppDir,
    configFileName = Constants.configPreferredFileName
) => {
    return createConfigFile(targetDir, configFileName);
};

const load = configParam => {

    if (configParam) {
        configData = configParam;
        return configParam;
    }

    if (configData) {
        return configData;
    }

    if (isTestEnv()) {
        return require(path.join('..', '..', '..', 'spec', Constants.configPreferredFileName));
    }

    if (!existConfigFile()) {
        const ConsoleUtils   = require('./ConsoleUtils');
        const ExceptionUtils = require('./ExceptionUtils');

        ConsoleUtils.displayConfigError();
        throw ExceptionUtils.emptyException();
    }

    let config = null;
    try {
        config = require(Constants.configPreferredFilePath);
    } catch (err) {
        config = require(Constants.configFilePath);
    }

    addParamsToConfig(config);

    return config;
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
    process.argv.forEach( val => {
        if (val === '--autofix') {
            config.autoFix = true;
        }
    });
};

const existConfigFile = () => {
    return configData ||
        FileUtils.fileExists(Constants.configFilePath) ||
        FileUtils.fileExists(Constants.configPreferredFilePath);
};

const isTestEnv = () => process.env.NODE_ENV === Constants.ENV_TEST;

module.exports.init        = init;
module.exports.load        = load;
module.exports.clearConfig = clearConfig;
