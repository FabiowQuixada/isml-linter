const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = 'Avoid direct call to the "dw" package, use "require()" instead';
const regex       = /dw\.[A-Za-z]+\.[A-Za-z]+(\.|;)/;

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(line) { return line.match(regex); };

Rule.getFirstOccurrence = function(line) {

    let result = null;

    if (this.isBroken(line)) {

        const temp     = regex.exec(line);
        const matchPos = temp.index;

        result = {
            columnStart : matchPos,
            length      : temp[0].length -  1
        };
    }

    return result;
};

module.exports = Rule;
