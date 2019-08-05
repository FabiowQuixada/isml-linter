const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Template file name must be lowercase';

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(fileName) { return fileName !== fileName.toLowerCase(); };

Rule.check = function(fileName, templateContent) {
    this.result = {
        occurrences : []
    };

    if (this.isBroken(fileName)) {
        this.add('', -1, 0, templateContent.length);
    }

    return this.result;
};

module.exports = Rule;
