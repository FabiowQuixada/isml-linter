#!/usr/bin/env node

require('../src/util/NativeExtensionUtils');

const IsmlLinter = require('../src/publicApi');
const exitCode   = IsmlLinter.build();

for (let i = 0; i < process.argv.length; i++) {
    process.argv[i] === '--build' && process.exit(exitCode);
}
