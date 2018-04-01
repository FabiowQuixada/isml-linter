const AbstractSingleLineRule = require('../AbstractSingleLineRule');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Wrap expression in <isprint> tag';

class Rule extends AbstractSingleLineRule {
    constructor() { super(ruleName, description); }

    isBroken(line) { return line.indexOf('>${') !== -1 || line.indexOf(' ${') !== -1; }
}

module.exports = new Rule;
