const AbstractSingleLineRule = require('../AbstractSingleLineRule');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Lines ends with a blank space';

class Rule extends AbstractSingleLineRule {
    constructor() { super(ruleName, description); }

    isBroken(line) { return line.endsWith(' ') && line.replace(/\s/g, '').length; }
}

module.exports = new Rule;
