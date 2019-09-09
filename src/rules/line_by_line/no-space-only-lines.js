const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');
const Constants               = require('../../Constants');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Line contains only blank spaces';

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(line) { return line !== '' && line !== '\r' && line !== Constants.EOL && !/\S/.test(line); };

Rule.getFixedContent = function(templateContent) {
    const GeneralUtils = require('../../util/GeneralUtils');

    const activeLineBreak = GeneralUtils.getActiveLinebreak();
    const lineArray       = templateContent.split(Constants.EOL);
    const result          = [];

    for (let i = 0; i < lineArray.length; i++) {
        const line = lineArray[i];

        result.push(line.trim() ? line : line.trim());
    }

    return result.join(activeLineBreak);
};

Rule.getFirstOccurrence = function(line) {

    let result = null;

    if (this.isBroken(line)) {
        result = {
            globalPos : 0,
            length      : line.length + 1
        };
    }

    return result;
};

module.exports = Rule;
