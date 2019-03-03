#!/usr/bin/env node

const Builder  = require('../index').Builder;
const exitCode = Builder.run();

process.exit(exitCode);
