const AbstractSingleLineRule = require('../AbstractSingleLineRule');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Unresolved Git conflict';

class Rule extends AbstractSingleLineRule {
    constructor() { super(ruleName, description); }

    isBroken(line) { return this.isEqual(line, '<<<<<<< HEAD') || this.isEqual(line, '======='); }
}

module.exports = new Rule;
