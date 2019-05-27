#!/usr/bin/env node

require('../src/app/util/NativeExtensionUtils');

const ConfigUtils = require('../src/app/util/ConfigUtils');

try {
    process.argv.forEach( val => {
        if (val === '--init') {
            ConfigUtils.init() &&
            process.exit(0);
        }
    });

    const IsmlLinter = require('isml-linter');
    const exitCode   = IsmlLinter.build();

    process.argv.forEach( val => {
        val === '--build' && process.exit(exitCode);
    });

} catch (e) {
    const ConsoleUtils = require('../src/app/util/ConsoleUtils');
    ConsoleUtils.printExceptionMsg(e.stack || e);
    process.exit(1);
}
