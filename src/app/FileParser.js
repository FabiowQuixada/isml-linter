const RulesHolder  = require('./RulesHolder');
const TreeBuilder  = require('./isml_tree/TreeBuilder');
const ConfigLoader = require('./ConfigLoader');

const config      = ConfigLoader.load();
const ENTRY_TYPES = {
    ERROR: 'errors',
    WARNING: 'warnings',
    INFO: 'info'
};

const addLineError = (parser, type, rule, result) => {
    parser.output[type]                   = parser.output[type] || {};
    parser.output[type][rule.description] = parser.output[type][rule.description] || [];

    result.occurrences.forEach( res => {
        parser.output[type][rule.description].push(res);
    });
};

const checkLineByLineRules = (fileContent, parser) => {
    RulesHolder.getEnabledLineRules().forEach(rule => {
        const result = rule.check(fileContent);
        if (result.occurrences.length) {
            addLineError(parser, ENTRY_TYPES.ERROR, rule, result);
        }
    });
};

const parse = fileContent => {
    const that  = this;
    this.output = {};

    checkLineByLineRules(fileContent, that);

    if (!config.disableTreeParse) {
        TreeBuilder.parse(fileContent);
    }

    return this.output;
};

const FileParser = {
    parse,
    ENTRY_TYPES
};

module.exports = FileParser;
