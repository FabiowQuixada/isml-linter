const AbstractSingleLineRule = require('../AbstractSingleLineRule');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Line contains only blank spaces';

const Rule = Object.create(AbstractSingleLineRule);

Rule.build(ruleName, description);

Rule.isBroken = function(line) { return line !== '' && line !== '\r' && line !== '\n' && !/\S/.test(line); };

module.exports = Rule;
