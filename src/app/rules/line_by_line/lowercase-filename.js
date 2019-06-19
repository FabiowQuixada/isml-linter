const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = 'Template file name must be lowercase';

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(fileName) { return fileName !== fileName.toLowerCase(); };

Rule.check = function(fileName, fileContent) {
    this.result = {
        occurrences : []
    };

    if (this.isBroken(fileName)) {
        this.add('', -1, 0, fileContent.length);
    }

    return this.result;
};

module.exports = Rule;
