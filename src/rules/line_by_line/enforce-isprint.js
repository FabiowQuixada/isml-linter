const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');
const ParseUtils              = require('../../isml_tree/ParseUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Wrap expression in <isprint> tag';

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(line) {
    return (line.indexOf('>${') >= 0 ||
        line.indexOf(' ${') >= 0 ||
        line.indexOf('"${') >= 0) &&
        line.indexOf('<isprint value="${') === -1 ||
        line.indexOf('${') === 0;
};

Rule.getColumnNumber = function(line) {
    return Math.max(ParseUtils.getNextNonEmptyCharPos(line), 0) + 1;
};

Rule.getFirstOccurrence = function(line) {

    let result = null;

    if (this.isBroken(line)) {

        let matchPos = -1;

        if (line.indexOf('>${') >= 0) {
            matchPos = line.indexOf('>${') + 1;
        } else if (line.indexOf(' ${') >= 0) {
            matchPos = line.indexOf(' ${') + 1;
        } else if (line.indexOf('"${') >= 0 && line.indexOf('<isprint value="${') === -1) {
            matchPos = line.indexOf('"${') + 1;
        } else if (line.indexOf('${') === 0) {
            matchPos = 0;
        }

        const temp = line.substring(matchPos);

        result = {
            globalPos : matchPos,
            columnNumber: 'aa',
            length    : temp.indexOf('}') + 1
        };
    }

    return result;
};

module.exports = Rule;
