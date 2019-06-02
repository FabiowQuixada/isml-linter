#!/usr/bin/env node

const { exec }  = require('child_process');
const path      = require('path');
const Constants = require('../src/app/Constants');

const currentVersion = require(path.join(Constants.clientAppDir, 'package.json')).version;
const tag            = `v${currentVersion}`;

const commandChain = `
    git stash -u &&
    git tag ${tag} &&
    echo 'Pushing code and tags...' &&
    git push --follow-tags &&
    echo 'Publishing to npm...' &&
    npm publish &&
    echo 'Done!'`;

exec(commandChain, (err, stdout, stderr) => {
    if (err) {
        return;
    }

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});
