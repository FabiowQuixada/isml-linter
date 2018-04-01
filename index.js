const Constants = require('./src/app/Constants');
const IsmlLinter = require('./src/app/IsmlLinter');
const FileUtils = require('./src/app/FileUtils');
const ismlDir = Constants.clientAppDir;

FileUtils.createClientRootDir();
FileUtils.createClientDir('output');
FileUtils.createClientDir('metadata');

IsmlLinter.lint(ismlDir);
IsmlLinter.export(Constants.clientOutputDir, Constants.clientMetadataDir);
