const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');
const IndentRule              = require('../tree/indent');
const GeneralUtils            = require('../../util/GeneralUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Tab detected';

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(line) { return line.indexOf('\t') >= 0; };

Rule.getColumnNumber = function(line) {
    return Math.max(line.indexOf('  '), 0) + 1;
};

Rule.getFixedContent = function(templateContent) {
    const lineBreak    = GeneralUtils.getFileLineBreakStyle(templateContent);
    const indent       = IndentRule.getIndentation();
    const fixedContent = templateContent.replace(/\t/g, indent);

    return GeneralUtils.applyLineBreak(fixedContent, lineBreak);
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
