const SingleLineRulePrototype = require('./prototypes/SingleLineRulePrototype');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Avoid using inline style';

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(line) { return line.indexOf('style="') !== -1; };

module.exports = Rule;
