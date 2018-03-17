const reqlib = require('app-root-path').require;
const ismlDir = reqlib('/config.json').dir.rootTemplate;
const config = reqlib('/config.json');
const IsmlLinter = reqlib('/src/app/IsmlLinter');

const outputDir = config.dir.output;
const metadataDir = config.dir.metadata;

IsmlLinter.lint(ismlDir);
IsmlLinter.export(outputDir, metadataDir);
