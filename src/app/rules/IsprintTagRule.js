const SingleLineRulePrototype = require('./prototypes/SingleLineRulePrototype');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Wrap expression in <isprint> tag';

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(line) { return line.indexOf('>${') !== -1 || line.indexOf(' ${') !== -1; };

module.exports = Rule;
