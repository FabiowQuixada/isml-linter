const IsmlLinter   = require('./IsmlLinter');
const Builder      = require('./Builder');
const ConfigUtils  = require('./util/ConfigUtils');
const ConsoleUtils = require('./util/ConsoleUtils');

let linterResult = {};

module.exports = {
    setConfig    : json  => ConfigUtils.load(json),
    parse        : (path, content)  => {
        linterResult = IsmlLinter.run(path, content);
        return linterResult;
    },
    printResults : ()    => ConsoleUtils.displayOccurrences(linterResult),
    build        : path  => Builder.run(path),

    IsmlLinter,
    Builder
};
