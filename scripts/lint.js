#!/usr/bin/env node

require('../src/app/util/NativeExtensionUtils');

const Builder  = require('../publicApi').Builder;
const exitCode = Builder.run();

process.argv.forEach( val => {
    val === '--build' && process.exit(exitCode);
});
