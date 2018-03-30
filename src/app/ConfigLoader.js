const path = require('path');
const reqlib = require('app-root-path').require;
const Constants = reqlib('/src/app/Constants');

const loadCurrentEnvConfigurationFile = () => {
    if (process.env.NODE_ENV === Constants.ENV_TEST) {
        const config_path = path.join('src', 'spec', 'spec_config.json');
        return reqlib(config_path);
    }

    return require(Constants.clientAppDir + '/' + Constants.clientConfigFileName);
};

module.exports = {
    load: loadCurrentEnvConfigurationFile
};
