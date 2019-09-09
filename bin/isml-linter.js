#!/usr/bin/env node

require('../src/util/NativeExtensionUtils');

const ConfigUtils = require('../src/util/ConfigUtils');

try {
    for (let i = 0; i < process.argv.length; i++) {
        if (process.argv[i] === '--init') {
            ConfigUtils.init() &&
            process.exit(0);
        }
    }

    const IsmlLinter = require('isml-linter');
    const exitCode   = IsmlLinter.build();

    for (let i = 0; i < process.argv.length; i++) {
        process.argv[i] === '--build' && process.exit(exitCode);
    }

} catch (e) {
    const ConsoleUtils = require('../src/util/ConsoleUtils');
    ConsoleUtils.printExceptionMsg(e.stack || e);
    process.exit(1);
}
