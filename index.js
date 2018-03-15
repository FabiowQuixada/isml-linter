const reqlib = require('app-root-path').require;
const ismlDir = reqlib('/config.json').dir.rootTemplate;

reqlib('/src/app/IsmlLinter').lint(ismlDir);
