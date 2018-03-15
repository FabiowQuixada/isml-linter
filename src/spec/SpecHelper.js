const reqlib = require('app-root-path').require;
const config = reqlib('/config.json');
const FileUtils = reqlib('/src/app/FileUtils');

const outputFilePath = `${config.dir.specTemp}${config.file.output}`;
const reportFilePath = `${config.dir.specTemp}${config.file.report}`;
const metadataFilePath = `${config.dir.specTemp}${config.file.metadata}`;

module.exports = {
    getRule: specFileName => {
        const ruleName = specFileName.substr(0, specFileName.indexOf('Spec'));
        const rule = reqlib(`/src/app/rules/${ruleName}`);
        return rule;
    },

    cleanTempDirectory: () => {
        if (FileUtils.fileExists(config.dir.specTemp)) {
            FileUtils.deleteFile(outputFilePath);
            FileUtils.deleteFile(reportFilePath);
            FileUtils.deleteFile(metadataFilePath);
        }

        FileUtils.deleteDirectory(config.dir.specTemp);
    }
};
