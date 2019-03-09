const IsmlLinter   = require('./IsmlLinter');
const ConsoleUtils = require('./ConsoleUtils');

const issueQty = IsmlLinter.run().issueQty;

ConsoleUtils.displayResult(issueQty);

module.exports = issueQty;
