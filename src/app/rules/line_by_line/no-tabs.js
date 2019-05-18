const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');
const IndentRule              = require('../tree/indent');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = 'Tab detected';
const indent      = IndentRule.getIndentation();

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(line) { return line.indexOf('\t') !== -1; };

Rule.getFixedContent = function(fileContent) {
    return fileContent.replaceAll('\t', indent);
};

Rule.getFirstOccurrence = function(line) {

    let result = null;

    if (this.isBroken(line)) {
        result = {
            globalPos : line.indexOf('\t'),
            length      : 1
        };
    }

    return result;
};

module.exports = Rule;
