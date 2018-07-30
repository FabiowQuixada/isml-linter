const fs = require('fs');
const RulePrototype = require('./RulePrototype');

const SingleLineRulePrototype = Object.create(RulePrototype);

SingleLineRulePrototype.check = function(fileName) {

    const that = this;
    const lineArray = fs.readFileSync(fileName, 'utf-8').split('\n');
    this.result = {
        occurrences: []
    };

    lineArray.forEach( (line, lineNumber) => {
        if (that.isBroken(line)) {
            that.add(line, lineNumber);
        }
    });

    return this.result;
};

SingleLineRulePrototype.isMatch = function(line, string) {
    const regEx = new RegExp(string + '(\r)*', 'gi');
    return line.match(regEx);
};

module.exports = SingleLineRulePrototype;
