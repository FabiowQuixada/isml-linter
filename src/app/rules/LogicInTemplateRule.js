const SingleLineRulePrototype = require('./prototypes/SingleLineRulePrototype');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Avoid putting logic into ISML';

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(line) { return line.indexOf('<isscript>') !== -1; };

module.exports = Rule;
