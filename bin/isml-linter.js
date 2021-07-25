#!/usr/bin/env node

require('../src/util/NativeExtensionUtils');

const CommandLineUtils = require('../src/util/CommandLineUtils');
const ConfigUtils      = require('../src/util/ConfigUtils');

try {
    const commandObj = CommandLineUtils.parseCommand();

    if (!commandObj) {
        process.exit(0);
    }

    if (commandObj.options.indexOf('--init') >= 0) {
        ConfigUtils.init();
        process.exit(0);
    }

    const IsmlLinter       = require('../src/publicApi');
    const filePatternArray = commandObj.files;
    const exitCode         = IsmlLinter.build(filePatternArray);

    if (commandObj.options.indexOf('--build') >= 0) {
        process.exit(exitCode);
    }

} catch (e) {
    const ConsoleUtils = require('../src/util/ConsoleUtils');
    ConsoleUtils.printExceptionMsg(e.stack || e);
    process.exit(1);
}
