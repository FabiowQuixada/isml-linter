const RulePrototype = require('./RulePrototype');
const ConfigUtils   = require('../../util/ConfigUtils');
const GeneralUtils  = require('../../util/GeneralUtils');

const SingleLineRulePrototype = Object.create(RulePrototype);

SingleLineRulePrototype.check = function(templateContent, data = { isCrlfLineBreak : false }) {

    const lineBreak      = GeneralUtils.getFileLineBreakStyle(templateContent);
    const config         = ConfigUtils.load();
    const lineArray      = templateContent.split(lineBreak);
    const occurrenceList = [];
    let globalPos        = 0;

    for (let lineNumber = 0; lineNumber < lineArray.length; lineNumber++) {
        const line       = lineArray[lineNumber];
        const occurrence = this.getFirstOccurrence(line);

        if (occurrence) {
            let occurrenceGlobalPos = globalPos + occurrence.globalPos;
            const columnNumber      = this.getColumnNumber(line);

            if (data.isCrlfLineBreak) {
                occurrenceGlobalPos += lineNumber;
            }

            const error = this.getError(line, lineNumber + 1, columnNumber, occurrenceGlobalPos, occurrence.length);

            occurrenceList.push(error);
        }

        globalPos += line.length + 1;
    }

    if (occurrenceList.length &&
        config.autoFix &&
        this.getFixedContent) {
        return {
            occurrenceList,
            fixedContent : this.getFixedContent(templateContent)
        };
    }

    return {
        occurrenceList,
        fixedContent : templateContent
    };
};

module.exports = SingleLineRulePrototype;
