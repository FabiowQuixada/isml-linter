const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');
const GeneralUtils            = require('../../util/GeneralUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Template has more lines than allowed';

const Rule = Object.create(SingleLineRulePrototype);

Rule.getDefaultAttrs = () => {
    return {
        max : 350
    };
};

Rule.init(ruleId, description);

Rule.getColumnNumber = function() {
    return 1;
};

Rule.check = function(templateContent) {

    const lineBreak      = GeneralUtils.getFileLineBreakStyle(templateContent);
    const maxLines       = this.getConfigs().max;
    const lineArray      = templateContent.split(lineBreak);
    const columnNumber   = this.getColumnNumber();
    const occurrenceList = [];

    if (lineArray.length > maxLines) {
        const error = this.getError(lineArray[0], 1, columnNumber, 0, 0);
        occurrenceList.push(error);
    }

    return { occurrenceList };
};

module.exports = Rule;
