const reqlib = require('app-root-path').require;
const Constants = reqlib('/src/app/Constants');
const IsmlLinter = reqlib('/src/app/IsmlLinter');
const FileUtils = reqlib('/src/app/FileUtils');
const ismlDir = Constants.clientAppDir;

FileUtils.createClientRootDir();
FileUtils.createClientDir('output');
FileUtils.createClientDir('metadata');

IsmlLinter.lint(ismlDir);
IsmlLinter.export(Constants.clientOutputDir, Constants.clientMetadataDir);
