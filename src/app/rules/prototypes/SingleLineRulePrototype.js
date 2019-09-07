const RulePrototype = require('./RulePrototype');
const ConfigUtils   = require('../../util/ConfigUtils');
const Constants     = require('../../Constants');
const GeneralUtils  = require('../../util/GeneralUtils');

const SingleLineRulePrototype = Object.create(RulePrototype);

SingleLineRulePrototype.check = function(templateContent) {

    const config    = ConfigUtils.load();
    const lineArray = GeneralUtils.toLF(templateContent).split(Constants.EOL);
    this.result     = {
        occurrences : []
    };
    let globalPos   = 0;

    for (let lineNumber = 0; lineNumber < lineArray.length; lineNumber++) {
        const line       = lineArray[lineNumber];
        const occurrence = this.getFirstOccurrence(line);
        if (occurrence) {
            this.add(line, lineNumber, globalPos + occurrence.globalPos, occurrence.length);
        }

        globalPos += line.length + 1;
    }

    if (this.result.occurrences.length &&
        config.autoFix &&
        this.getFixedContent) {
        this.result.fixedContent = this.getFixedContent(templateContent);
    }

    return this.result;
};

module.exports = SingleLineRulePrototype;
