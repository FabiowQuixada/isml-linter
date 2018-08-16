const RulePrototype = require('./prototypes/RulePrototype');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Unbalanced <isif> tag';

const Rule = Object.create(RulePrototype);

Rule.init(ruleName, description);

Rule.check = function(fileContent) {

    const that = this;
    const lineArray = fileContent.split('\n');
    const openCloseRegex = /.*<isif .*<\/isif>.*/;
    const openingRegex = /.*<isif .*/;
    const closingRegex = /.*<\/isif>.*/;
    const unbalancedTags = [];
    this.result = {
        occurrences: []
    };

    lineArray.forEach( (line, lineNumber) => {
        if (!openCloseRegex.test(line)) {
            if (openingRegex.test(line)) {
                unbalancedTags.push({
                    line,
                    lineNumber
                });
            } else if (closingRegex.test(line)) {
                unbalancedTags.pop();
            }
        }
    });

    unbalancedTags.forEach( error => {
        that.add(error.line, error.lineNumber);
    });

    return this.result;
};

module.exports = Rule;
