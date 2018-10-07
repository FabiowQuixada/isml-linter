#!/usr/bin/env node

try {
    require('../src/app/LinterRunner.js');
} catch(e) {
    const ConsoleUtils = require('../src/app/ConsoleUtils');
    ConsoleUtils.printExceptionMsg(e.stack);
}
