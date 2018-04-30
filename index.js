const path = require('path');
const Constants = require('./src/app/Constants');
const IsmlLinter = require('./src/app/IsmlLinter');
const ConsoleUtils = require('./src/app/ConsoleUtils');
const ismlDir = Constants.clientAppDir;  

IsmlLinter.lint(ismlDir);
IsmlLinter.export(Constants.clientOutputDir, Constants.clientMetadataDir);

const issueQty = require(path.join(Constants.clientOutputDir, Constants.compiledOutputFileName)).total;

ConsoleUtils.displayResult(issueQty);
