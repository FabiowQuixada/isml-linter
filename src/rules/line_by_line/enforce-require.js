const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Avoid direct call to the "dw" package, use "require()" instead';
const regex       = /dw\.[A-Za-z]+\.[A-Za-z]+(\.|;)/;

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(line) { return line.match(regex); };

Rule.getColumnNumber = function(line) {
    return Math.max(line.indexOf('dw.'), 0) + 1;
};

Rule.getFirstOccurrence = function(line) {

    let result = null;

    if (this.isBroken(line)) {

        const temp     = regex.exec(line);
        const matchPos = temp.index;

        result = {
            globalPos : matchPos,
            length    : temp[0].length -  1
        };
    }

    return result;
};

module.exports = Rule;
