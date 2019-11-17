#!/usr/bin/env node

require('../src/util/NativeExtensionUtils');

const IsmlLinter       = require('../src/publicApi');
const CommandLineUtils = require('../src/util/CommandLineUtils');

const commandObj = CommandLineUtils.parseCommand();

if (!commandObj) {
    process.exit(0);
}

const exitCode = IsmlLinter.build(commandObj.files);

if (commandObj.options.indexOf('--build') !== -1) {
    process.exit(exitCode);
}
