const SingleLineRulePrototype = require('isml-linter/src/rules/prototypes/SingleLineRulePrototype');

const ruleId         = require('path').basename(__filename).slice(0, -3);
const description    = 'Avoid putting <script> tags into ISML';
const occurrenceText = '<script>';

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(line) { return line.indexOf(occurrenceText) !== -1; };

Rule.getFirstOccurrence = function(line) {

    let result = null;

    if (this.isBroken(line)) {

        const matchPos = line.indexOf(occurrenceText);

        result = {
            globalPos : matchPos,
            length      : occurrenceText.length
        };
    }

    return result;
};

module.exports = Rule;
