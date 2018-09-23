const path = require('path');
const Constants = require('./Constants');
const IsmlLinter = require('./IsmlLinter');
const ConsoleUtils = require('./ConsoleUtils');
const ismlDir = Constants.clientAppDir;

IsmlLinter.run(ismlDir);
IsmlLinter.export(Constants.clientOutputDir, Constants.clientMetadataDir);

const issueQty = require(path.join(Constants.clientOutputDir, Constants.compiledOutputFileName)).total;

ConsoleUtils.displayResult(issueQty);

module.exports = issueQty;
