const FileUtils = require('../app/FileUtils');
const Constants = require('../app/Constants');
const snake = require('to-snake-case');

const specTempDir = Constants.specTempDir;

const cleanTempDirectory = () => {
    FileUtils.deleteDirectoryRecursively(specTempDir);
};

module.exports = {
    getRule: specFileName => {
        const ruleName = specFileName.substr(0, specFileName.indexOf('Spec'));
        const rule = require(`../app/rules/${ruleName}`);
        return rule;
    },

    beforeEach: () => {
        process.env.NODE_ENV = Constants.ENV_TEST;
        cleanTempDirectory();
    },

    afterEach: () => {
        process.env.NODE_ENV = Constants.ENV_DEV;
        cleanTempDirectory();
    },

    getRuleSpecTemplate: (rule, fileNumber) => {
        return `${Constants.specRuleTemplateDir}/${snake(rule.name)}/file_${fileNumber}.isml`;
    }
};
