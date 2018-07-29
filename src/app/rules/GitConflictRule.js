const AbstractSingleLineRule = require('../AbstractSingleLineRule');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Unresolved Git conflict';

const Rule = Object.create(AbstractSingleLineRule);

Rule.build(ruleName, description);

Rule.isBroken = function(line) { return line === '<<<<<<< HEAD' || line === '======='; };

module.exports = Rule;
