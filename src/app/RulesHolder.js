const Constants = require('./Constants');

let rules = [];

require('fs').readdirSync(Constants.rulesDir).forEach( file => {
    rules.push(require('./rules/' + file));
});

module.exports = {
    rules,
    getEnabledRules : () => rules.filter( rule => rule.isEnabled() )
};
