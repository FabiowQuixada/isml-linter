const reqlib = require('app-root-path').require;
const ismlDir = reqlib('/config.json').dir.rootTemplate;
const config = reqlib('/config.json');
const Constants = reqlib('/src/app/Constants');
const IsmlLinter = reqlib('/src/app/IsmlLinter');

IsmlLinter.lint(ismlDir);
IsmlLinter.export(Constants.outputDir, Constants.metadataDir);
