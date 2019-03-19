const RulesHolder  = require('./RulesHolder');
const TreeBuilder  = require('./isml_tree/TreeBuilder');
const ConfigLoader = require('./ConfigLoader');
const fs           = require('fs');

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

const checkLineByLineRules = (filePath, parser) => {

    const fileContent = fs.readFileSync(filePath, 'utf-8');

    RulesHolder.getEnabledLineRules().forEach(rule => {
        const result = rule.check(fileContent);

        if (config.autoFix && result.fixedContent) {
            fs.writeFile(filePath, result.fixedContent, function (err) {
                // TODO
                if (err) console.log(err);
            });
        } else if (result.occurrences && result.occurrences.length) {
            addLineError(parser, ENTRY_TYPES.ERROR, rule, result);
        }
    });
};

const checkTreeRules = (filePath, parser) => {
    if (!config.disableTreeParse) {
        const tree = TreeBuilder.build(filePath);

        if (!tree.rootNode) {
            throw tree.message;
        }

        RulesHolder.getEnabledTreeRules().forEach(rule => {
            const result = rule.check(tree);
            if (config.autoFix && result.fixedContent) {
                fs.writeFile(filePath, result.fixedContent);
            }
            else if (result.occurrences && result.occurrences.length) {
                addLineError(parser, ENTRY_TYPES.ERROR, rule, result);
            }
        });
    }
};

const parse = filePath => {

    this.output = {};

    checkLineByLineRules(filePath, this);
    checkTreeRules(filePath, this);

    return this.output;
};

const FileParser = {
    parse,
    ENTRY_TYPES
};

module.exports = FileParser;
