const RuleUtils   = require('./util/RuleUtils');
const TreeBuilder = require('./isml_tree/TreeBuilder');
const ConfigUtils = require('./util/ConfigUtils');
const fs          = require('fs');

const config      = ConfigUtils.load();
const ENTRY_TYPES = {
    ERROR   : 'errors',
    WARNING : 'warnings',
    INFO    : 'info'
};

const addLineError = (parser, type, rule, result) => {
    parser.output[type]                   = parser.output[type] || {};
    parser.output[type][rule.description] = parser.output[type][rule.description] || [];

    result.occurrences.forEach( res => {
        parser.output[type][rule.description].push(res);
    });
};

const checkLineByLineRules = (filePath, parser, content) => {

    const fileContent = content || fs.readFileSync(filePath, 'utf-8');

    RuleUtils
        .getEnabledLineRules()
        .filter( rule => !rule.isIgnore(filePath))
        .forEach(rule => {
            const result = rule.check(fileContent);

            if (config.autoFix && result.fixedContent) {
                fs.writeFileSync(filePath, result.fixedContent, function (err) {
                    // TODO
                    if (err) console.log(err);
                });
            } else if (result.occurrences && result.occurrences.length) {
                addLineError(parser, ENTRY_TYPES.ERROR, rule, result);
            }
        });
};

const checkTreeRules = (filePath, parser, content) => {
    if (!config.disableTreeParse) {
        const fileContent = content || fs.readFileSync(filePath, 'utf-8');
        const tree        = TreeBuilder.build(filePath, fileContent);

        if (!tree.rootNode) {
            throw tree.exception;
        }

        RuleUtils
            .getEnabledTreeRules()
            .filter( rule => !rule.isIgnore(filePath))
            .forEach( rule => {
                const result = rule.check(tree.rootNode);
                if (config.autoFix && result.fixedContent) {
                    fs.writeFile(filePath, result.fixedContent);
                }
                else if (result.occurrences && result.occurrences.length) {
                    addLineError(parser, ENTRY_TYPES.ERROR, rule, result);
                }
            });
    }
};

const parse = (filePath, content) => {

    this.output = {};

    checkLineByLineRules(filePath, this, content);
    checkTreeRules(filePath, this, content);

    return this.output;
};

const FileParser = {
    parse,
    ENTRY_TYPES
};

module.exports = FileParser;
