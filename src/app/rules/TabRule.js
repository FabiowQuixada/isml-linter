const AbstractSingleLineRule = require('../AbstractSingleLineRule');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Tab detected';

const Rule = Object.create(AbstractSingleLineRule);

Rule.build(ruleName, description);

Rule.isBroken = function(line) { return line.indexOf('\t') !== -1; };

module.exports = Rule;
