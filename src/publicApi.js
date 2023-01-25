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
    fix          : (path, content, config) => {
        let autofixConfig = config;

        if (config) {
            autofixConfig.autoFix = true;
            IsmlLinter.setConfig(autofixConfig);
        } else {
            autofixConfig         = IsmlLinter.getConfig();
            autofixConfig.autoFix = true;
            IsmlLinter.setConfig(autofixConfig);
        }

        return IsmlLinter.run(path, content, autofixConfig);
    },
    printResults : ()    => ConsoleUtils.displayOccurrenceList(linterResult),
    build        : path  => Builder.run(path),

    IsmlLinter,
    Builder
};
