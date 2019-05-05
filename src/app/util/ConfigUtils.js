const fs        = require('fs');
const path      = require('path');
const Constants = require('../Constants');
const FileUtils = require('./FileUtils');

const ConfigUtils = {};

ConfigUtils.init = function(
    targetDir = Constants.clientAppDir,
    configFileName = Constants.configPreferredFileName
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

    if (isTestEnv()) {
        return require(path.join('..', '..', 'spec', Constants.configPreferredFileName));
    }

    if (!existConfigFile()) {
        this.init();
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

ConfigUtils.clear = function() {
    this.config = null;
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
    process.argv.forEach(val => {
        if (val === '--autofix') {
            config.autoFix = true;
        }
    });
};

const existConfigFile = () => {
    return FileUtils.fileExists(Constants.configFilePath) ||
        FileUtils.fileExists(Constants.configPreferredFilePath);
};

const isTestEnv = () => process.env.NODE_ENV === Constants.ENV_TEST;

module.exports = ConfigUtils;
