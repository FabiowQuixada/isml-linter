const AbstractSingleLineRule = require('../AbstractSingleLineRule');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Blank space at the end of the line detected';

class Rule extends AbstractSingleLineRule {
    constructor() { super(ruleName, description); }

    isBroken(line) { return line.endsWith(' ') && line.replace(/\s/g, '').length; }
}

module.exports = new Rule;
