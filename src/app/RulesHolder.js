const path      = require('path');
const Constants = require('./Constants');

const rules = [];

require('fs')
    .readdirSync(Constants.lineByLineRulesDir)
    .filter( file => file.endsWith('.js'))
    .forEach( file => {
        const rulePath = path.join(__dirname, 'rules', 'line_by_line', file);
        rules.push(require(rulePath));
    });

module.exports = {
    getAllRules : () => rules,
    getEnabledRules : () => rules.filter( rule => rule.isEnabled() )
};
