#!/usr/bin/env node

const Builder = require('isml-linter').Builder;
const exitCode = Builder.run();

process.exit(exitCode);
