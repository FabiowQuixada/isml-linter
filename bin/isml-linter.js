#!/usr/bin/env node

try {
    const Builder  = require('isml-linter').Builder;
    const exitCode = Builder.run();

    process.argv.forEach( val => {
        val === '--build' && process.exit(exitCode);
    });

} catch(e) {
    const ConsoleUtils = require('../src/app/ConsoleUtils');
    ConsoleUtils.printExceptionMsg(e.stack);
}
