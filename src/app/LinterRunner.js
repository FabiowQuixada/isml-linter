const path = require('path');
const Constants = require('./Constants');
const IsmlLinter = require('./IsmlLinter');
const ConsoleUtils = require('./ConsoleUtils');

IsmlLinter.run();
IsmlLinter.export();

const issueQty = require(path.join(Constants.clientOutputDir, Constants.compiledOutputFileName)).total;

ConsoleUtils.displayResult(issueQty);

module.exports = issueQty;
