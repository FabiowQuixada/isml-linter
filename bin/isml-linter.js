#!/usr/bin/env node
require('../src/app/util/NativeExtensionUtils');

try {
    const Builder  = require('isml-linter').Builder;
    const exitCode = Builder.run();

    process.argv.forEach( val => {
        val === '--build' && process.exit(exitCode);
    });

} catch(e) {
    const ConsoleUtils = require('../src/app/util/ConsoleUtils');
    ConsoleUtils.printExceptionMsg(e.stack || e);
}
