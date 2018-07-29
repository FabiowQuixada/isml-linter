const AbstractSingleLineRule = require('../AbstractSingleLineRule');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Avoid using inline style';

const Rule = Object.create(AbstractSingleLineRule);

Rule.build(ruleName, description);

Rule.isBroken = function(line) { return line.indexOf('style="') !== -1; };

module.exports = Rule;
