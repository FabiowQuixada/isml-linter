const RulesHolder = require('./RulesHolder');
const fs = require('fs');

const ENTRY_TYPES = {
    ERROR: 'errors',
    WARNING: 'warnings',
    INFO: 'info'
};

const add = (parser, type, rule, result) => {
    parser.output = parser.output || {};
    parser.output[type] = parser.output[type] || {};
    parser.output[type][rule.description] = parser.output[type][rule.description] || [];

    if (result.occurrences) {
        result.occurrences.forEach( res => {
            parser.output[type][rule.description].push(res);
        });
    }
};

const parse = fileName => {
    const that = this;
    this.output = {};

    RulesHolder.getEnabledRules().forEach( rule => {
        const result = rule.check(fileName);

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
