const AbstractSingleLineRule = require('../AbstractSingleLineRule');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Line contains only blank spaces';

class Rule extends AbstractSingleLineRule {
    constructor() { super(ruleName, description); }

    isBroken(line) { return line !== '' && line !== '\r' && line !== '\n' && !/\S/.test(line); }
}

module.exports = new Rule;
