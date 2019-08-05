const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');
const Constants               = require('../../Constants');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Blank space at the end of the line detected';

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(line) { return (line.endsWith(' ') || line.endsWith(' \r')) && line.replace(/\s/g, '').length; };

Rule.getFixedContent = function(templateContent) {
    return templateContent
        .split(Constants.EOL)
        .map( line => line.replace(/\s+$/g, ''))
        .join(Constants.EOL);
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
