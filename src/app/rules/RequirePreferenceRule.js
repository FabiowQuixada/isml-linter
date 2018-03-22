const reqlib = require('app-root-path').require;
const config = reqlib('/src/app/ConfigLoader').load();

const ruleName = require('path').basename(__filename).slice(0, -3);

module.exports = {
    name: ruleName,
    title: 'Use require(\'pref\').get(...)',
    isEnabled: () => config.disabledRules.indexOf(ruleName) === -1,
    isBroken: line => /.*Resource.msg\(.*_preferences.*/.test(line)
};
