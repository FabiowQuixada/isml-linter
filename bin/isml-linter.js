#!/usr/bin/env node

require('../src/app/util/NativeExtensionUtils');

const ConfigUtils = require('../src/app/util/ConfigUtils');

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
    const ConsoleUtils = require('../src/app/util/ConsoleUtils');
    ConsoleUtils.printExceptionMsg(e.stack || e);
    process.exit(1);
}
