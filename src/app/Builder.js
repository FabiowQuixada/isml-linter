
const run = () => {
    const IsmlLinter   = require('./IsmlLinter');
    const ConsoleUtils = require('./ConsoleUtils');

    const lintResults = IsmlLinter.run();
    const errorQty    = Object.keys(lintResults.errors).length;

    ConsoleUtils.displayErrors(lintResults);

    return errorQty > 0 ? 1 : 0;
};

module.exports = {
    run
};
