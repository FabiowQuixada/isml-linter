const reqlib = require('app-root-path').require;
const ismlDir = reqlib('/config.json').rootTemplateDir;
const Constants = reqlib('/src/app/Constants');
const IsmlLinter = reqlib('/src/app/IsmlLinter');
const FileUtils = reqlib('/src/app/FileUtils');

FileUtils.createClientRootDir();
FileUtils.createClientDir('output');
FileUtils.createClientDir('metadata');

IsmlLinter.lint(ismlDir);
IsmlLinter.export(Constants.clientOutputDir, Constants.clientMetadataDir);
