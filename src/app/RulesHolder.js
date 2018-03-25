const reqlib = require('app-root-path').require;
const Constants = reqlib('/src/app/Constants');

let rules = [];

require('fs').readdirSync(Constants.rulesDir).forEach( file => {
    rules.push(require('./rules/' + file));
});

module.exports = {
    rules,
    getEnabledRules : () => rules.filter( rule => rule.isEnabled() )
};
