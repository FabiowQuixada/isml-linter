
const run = () => {
    const IsmlLinter   = require('./IsmlLinter');
    const ConsoleUtils = require('./ConsoleUtils');

    const lintResults = IsmlLinter.run();

    ConsoleUtils.displayErrors(lintResults);

    return lintResults.issueQty > 0 ? 1 : 0;
};

module.exports = {
    run
};
