const reqlib = require('app-root-path').require;
const FileUtils = reqlib('/src/app/FileUtils');
const Constants = reqlib('/src/app/Constants');

const specTempDir = Constants.specTempDir;

const cleanTempDirectory = () => {
    FileUtils.deleteDirectoryRecursively(specTempDir);
};

module.exports = {
    getRule: specFileName => {
        const ruleName = specFileName.substr(0, specFileName.indexOf('Spec'));
        const rule = reqlib(`/src/app/rules/${ruleName}`);
        return rule;
    },

    beforeEach: () => {
        process.env.NODE_ENV = Constants.ENV_TEST;
        cleanTempDirectory();
    },

    afterEach: () => {
        process.env.NODE_ENV = Constants.ENV_DEV;
        cleanTempDirectory();
    }
};
