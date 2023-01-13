const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');

const ruleId         = require('path').basename(__filename).slice(0, -3);
const description    = 'Avoid using inline style';
const occurrenceText = ' style="';

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(line) { return line.indexOf('<isprint') === -1 && line.indexOf(occurrenceText) >= 0; };

Rule.getColumnNumber = function(line) {
    return Math.max(line.indexOf(occurrenceText), 0) + 2;
};

Rule.getFirstOccurrence = function(line) {

    let result = null;

    if (this.isBroken(line)) {

        const matchPos = line.indexOf(occurrenceText);

        result = {
            globalPos : matchPos + 1,
            length    : occurrenceText.length - 3
        };
    }

    return result;
};

module.exports = Rule;
