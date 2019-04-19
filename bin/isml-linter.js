#!/usr/bin/env node
require('../src/app/util/NativeExtensionUtils');

try {
    const IsmlLinter = require('isml-linter');
    const exitCode   = IsmlLinter.build();

    process.argv.forEach( val => {
        val === '--build' && process.exit(exitCode);
    });

} catch(e) {
    const ConsoleUtils = require('../src/app/util/ConsoleUtils');
    ConsoleUtils.printExceptionMsg(e.stack || e);
}
