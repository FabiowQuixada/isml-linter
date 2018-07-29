const AbstractSingleLineRule = require('../AbstractSingleLineRule');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Wrap expression in <isprint> tag';

const Rule = Object.create(AbstractSingleLineRule);

Rule.build(ruleName, description);

Rule.isBroken = function(line) { return line.indexOf('>${') !== -1 || line.indexOf(' ${') !== -1; };

module.exports = Rule;
