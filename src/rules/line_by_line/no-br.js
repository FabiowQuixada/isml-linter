const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');

const ruleId         = require('path').basename(__filename).slice(0, -3);
const description    = 'Avoid using <br/> tags, use css instead';
const occurrenceText = '<br';

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(line) { return line.indexOf(occurrenceText) !== -1; };

Rule.getFirstOccurrence = function(line) {

    let result = null;

    if (this.isBroken(line)) {

        const matchPos    = line.indexOf(occurrenceText);
        const temp        = line.substring(line.indexOf(occurrenceText));
        const matchLength = temp.indexOf('>') + 1;

        result = {
            globalPos : matchPos,
            length      : matchLength
        };
    }

    return result;
};

module.exports = Rule;
