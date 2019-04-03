#!/usr/bin/env node

const { exec }  = require('child_process');
const path      = require('path');
const Constants = require('../app/Constants');

const currentVersion = require(path.join(Constants.clientAppDir, 'package.json')).version;
const tag            = `v${currentVersion}`;

const commandChain = `
    npm stash -u &&
    npm tag ${tag} &&
    npm push &&
    npm push --tags &&
    npm publish`;

exec(commandChain, (err, stdout, stderr) => {
    if (err) {
        return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});
