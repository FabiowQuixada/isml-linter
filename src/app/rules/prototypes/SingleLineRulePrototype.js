const RulePrototype = require('./RulePrototype');

const SingleLineRulePrototype = Object.create(RulePrototype);

SingleLineRulePrototype.check = function(fileContent) {

    const that = this;
    const lineArray = fileContent.split('\n');
    this.result = {
        occurrences: []
    };
    let globalPos = 0;

    lineArray.forEach( (line, lineNumber) => {
        const occurrence = that.getFirstOccurrence(line);
        if (occurrence) {
            that.add(line, lineNumber, globalPos + occurrence.columnStart, occurrence.length);
        }

        globalPos += line.length+1;
    });

    return this.result;
};

module.exports = SingleLineRulePrototype;
