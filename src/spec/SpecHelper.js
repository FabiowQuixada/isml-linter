const reqlib = require('app-root-path').require;
const FileUtils = reqlib('/src/app/FileUtils');
const Constants = reqlib('/src/app/Constants');

const specTempDir = Constants.specTempDir;
const outputFilePath = Constants.specOutputFilePath;
const reportFilePath = Constants.specReportFilePath;
const metadataFilePath = Constants.specMetadataFilePath;

module.exports = {
    getRule: specFileName => {
        const ruleName = specFileName.substr(0, specFileName.indexOf('Spec'));
        const rule = reqlib(`/src/app/rules/${ruleName}`);
        return rule;
    },

    cleanTempDirectory: () => {
        if (FileUtils.fileExists(specTempDir)) {
            FileUtils.deleteFile(outputFilePath);
            FileUtils.deleteFile(reportFilePath);
            FileUtils.deleteFile(metadataFilePath);
            // FileUtils.deleteFile('src/spec/temp/undefined');
        }

        FileUtils.deleteDirectory(specTempDir);
    }
};
