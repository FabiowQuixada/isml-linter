#!/usr/bin/env node

require('../src/app/util/NativeExtensionUtils');

const IsmlLinter = require('../src/app/publicApi');
const exitCode   = IsmlLinter.build();

process.argv.forEach( val => {
    val === '--build' && process.exit(exitCode);
});
