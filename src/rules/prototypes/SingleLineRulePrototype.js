const RulePrototype = require('./RulePrototype');
const ConfigUtils   = require('../../util/ConfigUtils');
const Constants     = require('../../Constants');
const GeneralUtils  = require('../../util/GeneralUtils');

const SingleLineRulePrototype = Object.create(RulePrototype);

SingleLineRulePrototype.check = function(templateContent, results, data = { isCrlfLineBreak : false }) {

    const config    = ConfigUtils.load();
    const lineArray = GeneralUtils.toLF(templateContent).split(Constants.EOL);
    const result2   = {
        occurrences : []
    };
    let globalPos   = 0;

    for (let lineNumber = 0; lineNumber < lineArray.length; lineNumber++) {
        const line       = lineArray[lineNumber];
        const occurrence = this.getFirstOccurrence(line);

        if (occurrence) {
            let occurrenceGlobalPos = globalPos + occurrence.globalPos;

            if (data.isCrlfLineBreak) {
                occurrenceGlobalPos += lineNumber;
            }

            const error = this.getError(line, lineNumber, occurrenceGlobalPos, occurrence.length);

            result2.occurrences.push(error);
        }

        globalPos += line.length + 1;
    }

    if (result2.occurrences.length &&
        config.autoFix &&
        this.getFixedContent) {
        result2.fixedContent = this.getFixedContent(templateContent);
    }

    return result2;
};

module.exports = SingleLineRulePrototype;
