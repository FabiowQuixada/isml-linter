const AbstractSingleLineRule = require('../AbstractSingleLineRule');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Blank space at the end of the line detected';

const Rule = Object.create(AbstractSingleLineRule);

Rule.build(ruleName, description);

Rule.isBroken = function(line) { return line.endsWith(' ') && line.replace(/\s/g, '').length; };

module.exports = Rule;
