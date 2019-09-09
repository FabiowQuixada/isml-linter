const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');

const ruleId          = require('path').basename(__filename).slice(0, -3);
const description     = 'Unresolved Git conflict';
const occurrenceText1 = '<<<<<<< HEAD';
const occurrenceText2 = '=======';

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(line) { return line === occurrenceText1 || line === occurrenceText2; };

Rule.getFirstOccurrence = function(line) {

    let result = null;

    if (this.isBroken(line)) {

        let occurrenceText = null;

        if (line === occurrenceText1) {
            occurrenceText = occurrenceText1;
        } else if (line === occurrenceText2) {
            occurrenceText = occurrenceText2;
        }

        const matchPos = line.indexOf(occurrenceText);

        result = {
            globalPos : matchPos,
            length      : occurrenceText.length
        };
    }

    return result;
};

module.exports = Rule;
