const AbstractSingleLineRule = require('../AbstractSingleLineRule');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Avoid direct call to the "dw" package, use "require()" instead';

class Rule extends AbstractSingleLineRule {
    constructor() { super(ruleName, description); }

    isBroken(line) { return line.indexOf('dw.') !== -1; }
}

module.exports = new Rule;
