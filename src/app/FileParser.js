const RulesHolder = require('./RulesHolder');

const ENTRY_TYPES = {
    ERROR: 'errors',
    WARNING: 'warnings',
    INFO: 'info'
};

const add = (parser, type, rule, result) => {
    parser.output[type] = parser.output[type] || {};
    parser.output[type][rule.description] = parser.output[type][rule.description] || [];

    result.occurrences.forEach( res => {
        parser.output[type][rule.description].push(res);
    });
};

const parse = fileContent => {
    const that = this;
    this.output = {};

    RulesHolder.getEnabledRules().forEach( rule => {
        const result = rule.check(fileContent);

        if (result.occurrences.length) {
            add(that, ENTRY_TYPES.ERROR, rule, result);
        }
    });

    return this.output;
};

const FileParser = {
    parse,
    ENTRY_TYPES
};

module.exports = FileParser;
