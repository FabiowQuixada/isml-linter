#!/usr/bin/env node

const { exec }  = require('child_process');
const path      = require('path');
const Constants = require('../src/app/Constants');

const currentVersion = require(path.join(Constants.clientAppDir, 'package.json')).version;
const tag            = `v${currentVersion}`;

const commandChain = `
    git stash -u &&
    git tag ${tag} &&
    git push &&
    git push --tags &&
    npm publish`;

exec(commandChain, (err, stdout, stderr) => {
    if (err) {
        return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});
