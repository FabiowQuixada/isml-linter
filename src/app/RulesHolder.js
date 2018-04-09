const path = require('path');
const Constants = require('./Constants');

let rules = [];

require('fs').readdirSync(Constants.rulesDir).forEach( file => {
    const rulePath = path.join(__dirname, 'rules', file);
    rules.push(require(rulePath));
});

module.exports = {
    rules,
    getEnabledRules : () => rules.filter( rule => rule.isEnabled() )
};
