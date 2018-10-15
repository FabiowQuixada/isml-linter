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

const createClientDirectories = dir => {
    FileUtils.createDirIfDoesNotExist(dir);
    FileUtils.createClientDir('output', dir);
};

const createConfigFile = (targetDir = Constants.configFilePath, configFileName) => {

    if (!FileUtils.fileExists(path.join(targetDir, configFileName))) {
        const configContent = {
            rules: {}
        };

        require('fs').readdirSync(Constants.rulesDir).forEach( filename => {
            if (filename.endsWith('.js')) {
                const ruleName = filename.slice(0, -3);
                configContent.rules[ruleName] = {};
            }
        });

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

module.exports = {
    init,
    load: loadCurrentEnvConfigurationFile
};
