const RulePrototype = require('./RulePrototype');
const ConfigUtils   = require('../../util/ConfigUtils');

const SingleLineRulePrototype = Object.create(RulePrototype);

SingleLineRulePrototype.check = function(fileContent) {

    const that      = this;
    const config    = ConfigUtils.load();
    const lineArray = fileContent.split('\n');
    this.result     = {
        occurrences: []
    };
    let globalPos   = 0;

    lineArray.forEach( (line, lineNumber) => {
        const occurrence = that.getFirstOccurrence(line);
        if (occurrence) {
            that.add(line, lineNumber, globalPos + occurrence.columnStart, occurrence.length);
        }

        globalPos += line.length+1;
    });

    if (this.result.occurrences.length &&
        config.autoFix &&
        this.getFixedContent) {
        this.result.fixedContent = this.getFixedContent(fileContent);
    }

    return this.result;
};

module.exports = SingleLineRulePrototype;
