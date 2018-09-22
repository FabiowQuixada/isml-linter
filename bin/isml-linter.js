#!/usr/bin/env node

try {
    process.env.NODE_ENV = 'prod';

    require('../src/app/LinterRunner.js');
} catch(e) {
    const ConsoleUtils = require('../src/app/ConsoleUtils');
    ConsoleUtils.printExceptionMsg(e);
}
