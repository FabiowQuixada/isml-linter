
const run = path => {
    const IsmlLinter   = require('./IsmlLinter');
    const ConsoleUtils = require('./util/ConsoleUtils');

    const lintResults = IsmlLinter.run(path);

    ConsoleUtils.displayOccurrences(lintResults);

    return lintResults.issueQty > 0 ? 1 : 0;
};

module.exports = {
    run
};
