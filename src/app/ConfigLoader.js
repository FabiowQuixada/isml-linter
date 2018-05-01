const path = require('path');
const Constants = require('./Constants');
const FileUtils = require('./FileUtils');

const loadCurrentEnvConfigurationFile = () => {

    if (process.env.NODE_ENV === Constants.ENV_TEST) {
        return require(path.join(Constants.specDir, Constants.specConfigFileName));
    }


    if (!FileUtils.fileExists(Constants.configFilePath)) {
        init();
    }

    return require(Constants.configFilePath);
};

const createClientDirectories = () => {
    FileUtils.createClientRootDir();
    FileUtils.createClientDir('output');
    //FileUtils.createClientDir('metadata');
};

const createConfigFile = () => {
    if (!FileUtils.fileExists(Constants.configFilePath)) {
        const configContent = {};
        configContent.enabledRules = {};

        require('fs').readdirSync(Constants.rulesDir).forEach( filename => {
            const ruleName = filename.slice(0, -3);
            configContent.enabledRules[ruleName] = {};
        });

        FileUtils.saveToJsonFile(Constants.clientAppDir, Constants.clientConfigFileName, configContent);
    }
};

const init = () => {
    createClientDirectories();
    createConfigFile();
};

module.exports = {
    load: loadCurrentEnvConfigurationFile
};
