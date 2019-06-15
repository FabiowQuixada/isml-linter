const RulePrototype = require('./RulePrototype');
const ConfigUtils   = require('../../util/ConfigUtils');
const Constants     = require('../../Constants');

const SingleLineRulePrototype = Object.create(RulePrototype);

SingleLineRulePrototype.check = function(fileContent) {

    const config    = ConfigUtils.load();
    const lineArray = fileContent.split(Constants.EOL);
    this.result     = {
        occurrences : []
    };
    let globalPos   = 0;

    lineArray.forEach( (line, lineNumber) => {
        const occurrence = this.getFirstOccurrence(line);
        if (occurrence) {
            this.add(line, lineNumber, globalPos + occurrence.globalPos, occurrence.length);
        }

        globalPos += line.length + 1;
    });

    if (this.result.occurrences.length &&
        config.autoFix &&
        this.getFixedContent) {
        this.result.fixedContent = this.getFixedContent(fileContent);
    }

    return this.result;
};

module.exports = SingleLineRulePrototype;
