const reqlib = require('app-root-path').require;
const Constants = reqlib('/src/app/Constants');

const loadCurrentEnvConfigurationFile = () => {
    if (process.env.NODE_ENV === Constants.ENV_TEST) {
        return reqlib('/src/spec/spec_config.json');
    }

    return reqlib('/config.json');
};


module.exports = {
    load: loadCurrentEnvConfigurationFile
};
