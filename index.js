const reqlib = require('app-root-path').require;
const ismlDir = reqlib('/config.json').rootTemplateDir;
const Constants = reqlib('/src/app/Constants');
const IsmlLinter = reqlib('/src/app/IsmlLinter');

IsmlLinter.lint(ismlDir);
IsmlLinter.export(Constants.outputDir, Constants.metadataDir);
