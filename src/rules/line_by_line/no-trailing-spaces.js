const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');
const ParseUtils              = require('../../isml_tree/ParseUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Blank space at the end of the line detected';

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(line) { return (line.endsWith(' ') || line.endsWith(' \r')) && line.replace(/\s/g, '').length; };

Rule.getColumnNumber = function(line) {
    const revertPosition = ParseUtils.getNextNonEmptyCharPos(line.split('').reverse().join(''));
    return Math.max(line.length - revertPosition, 0) + 1;
};

Rule.getFixedContent = function(templateContent) {
    const GeneralUtils = require('../../util/GeneralUtils');

    const lineBreak = GeneralUtils.getFileLineBreakStyle(templateContent);
    const lineArray = templateContent.split(lineBreak);
    const result    = [];

    for (let i = 0; i < lineArray.length; i++) {
        const line = lineArray[i];

        result.push(line.replace(/\s+$/g, ''));
    }

    return GeneralUtils.applyLineBreak(result.join(lineBreak), lineBreak);
};

Rule.getFirstOccurrence = function(line) {

    let result = null;

    if (this.isBroken(line)) {

        const matchPos = /(\t|\s)*$/.exec(line).index;

        result = {
            globalPos : matchPos,
            length      : line.length - matchPos
        };
    }

    return result;
};

module.exports = Rule;
