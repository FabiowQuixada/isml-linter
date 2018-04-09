const path = require('path');
const Constants = require('./Constants');

const loadCurrentEnvConfigurationFile = () => {

    if (process.env.NODE_ENV === Constants.ENV_TEST) {
        return require(path.join(Constants.specDir, Constants.specConfigFileName));
    }

    return require(path.join(Constants.clientAppDir, Constants.clientConfigFileName));
};

module.exports = {
    load: loadCurrentEnvConfigurationFile
};
