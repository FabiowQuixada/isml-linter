const IsmlLinter   = require('./IsmlLinter');
const Builder      = require('./Builder');
const ConsoleUtils = require('./util/ConsoleUtils');

let linterResult = {};

module.exports = {
    setConfig    : json  => IsmlLinter.setConfig(json),
    getConfig    : ()    => IsmlLinter.getConfig(),
    parse        : (path, content, config) => {

        if (config) {
            IsmlLinter.setConfig(config);
        }

        linterResult = IsmlLinter.run(path, content);
        return linterResult;
    },
    printResults : ()    => ConsoleUtils.displayOccurrenceList(linterResult),
    build        : path  => Builder.run(path),

    IsmlLinter,
    Builder
};
