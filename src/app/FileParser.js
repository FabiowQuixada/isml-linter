const RulesHolder = require('./RulesHolder');

const ENTRY_TYPES = {
    ERROR: 'errors',
    WARNING: 'warnings',
    INFO: 'info'
};

const getProcessedFilePath = fileName => {
    return fileName.substring(fileName.indexOf('default') + 8);
};

const add = (parser, type, rule, fileName, result) => {
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
            const processedFilePath = getProcessedFilePath(fileName);
            add(that, ENTRY_TYPES.ERROR, rule, processedFilePath, result);
        }
    });

    return this.output;
};

const FileParser = {
    parse,
    ENTRY_TYPES
};

module.exports = FileParser;
