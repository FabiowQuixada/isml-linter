#!/usr/bin/env node

const { spawn } = require('child_process');
const path      = require('path');
const Constants = require('../src/Constants');

const currentVersion = require(path.join(Constants.clientAppDir, 'package.json')).version;
const tag            = `v${currentVersion}`;

const isDryRun = process.argv.includes('--dry-run') || process.env.DRY_RUN === '1';

const commands = [
    'git stash -u',
    'echo Pushing code and tags...',
    isDryRun ? 'git push --dry-run' : 'git push',
    `git tag ${tag}`,
    isDryRun ? 'git push --tags --dry-run' : 'git push --tags',
    'echo Publishing to npm...',
    isDryRun ? 'npm publish --dry-run' : 'npm publish',
    'echo Done!',
    'git stash pop'
];

function run(cmd) {
    return new Promise((resolve, reject) => {
        console.log(`> ${cmd}`);
        const child = spawn(cmd, { shell: true, stdio: 'inherit' });
        child.on('error', reject);
        child.on('exit', code => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });
    });
}

(async () => {
    for (const cmd of commands) {
        await run(cmd);
    }
})().catch(err => {
    console.error('Release failed:', err.message);
    process.exitCode = 1;
});
