const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');
const Constants               = require('../../Constants');
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

Rule.check = function(templateContent) {

    const maxLines  = this.getConfigs().max;
    const lineArray = GeneralUtils.toLF(templateContent).split(Constants.EOL);
    this.result     = {
        occurrences : []
    };

    if (lineArray.length > maxLines) {
        this.add(lineArray[0], 0, 0, 0);
    }

    return this.result;
};

module.exports = Rule;
