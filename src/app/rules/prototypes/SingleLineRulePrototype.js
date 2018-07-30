const fs = require('fs');
const RulePrototype = require('./RulePrototype');

const SingleLineRulePrototype = Object.create(RulePrototype);

SingleLineRulePrototype.check = function(fileName, parser) {
    const that = this;
    const lineArray = fs.readFileSync(fileName, 'utf-8').split('\n');
    const simpleFileName = this.getProcessedFilePath(fileName);
    let isBroken = false;

    lineArray.forEach( (line, lineNumber) => {
        if (that.isBroken(line)) {
            parser.addError(that.description, simpleFileName, line, lineNumber);
            isBroken = true;
        }
    });

    return isBroken;
};

SingleLineRulePrototype.isMatch = function(line, string) {
    const regEx = new RegExp(string + '(\r)*', 'gi');
    return line.match(regEx);
};

module.exports = SingleLineRulePrototype;
