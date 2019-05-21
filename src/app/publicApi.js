const IsmlLinter   = require('./IsmlLinter');
const Builder      = require('./Builder');
const ConfigUtils  = require('./util/ConfigUtils');
const FileParser   = require('./FileParser');
const ConsoleUtils = require('./util/ConsoleUtils');

let linterResult = {};

module.exports = {
    setConfig    : json  => ConfigUtils.load(json),
    parse        : path  => {
        linterResult = IsmlLinter.run(path);
        return linterResult;
    },
    printResults : ()    => ConsoleUtils.displayErrors(linterResult),
    build        : ()    => Builder.run(),

    IsmlLinter,
    Builder,
    FileParser
};
