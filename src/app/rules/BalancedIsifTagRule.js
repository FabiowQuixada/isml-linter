const fs = require('fs');
const AbstractRule = require('../AbstractRule');

const ruleName = require('path').basename(__filename).slice(0, -3);
const description = 'Unbalanced <isif> tag';

class Rule extends AbstractRule {
    constructor() { super(ruleName, description); }

    check(fileName, parser) {
        const that = this;
        const lineArray = fs.readFileSync(fileName, 'utf-8').split('\n');
        const simpleFileName = fileName.substring(fileName.indexOf('default/') + 7);
        const openCloseRegex = /.*<isif .*<\/isif>.*/;
        const openingRegex = /.*<isif .*/;
        const closingRegex = /.*<\/isif>.*/;
        const unbalancedTags = [];

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
            parser.addError(that.description, simpleFileName, error.line, error.lineNumber);
        });

        return unbalancedTags.length > 0;
    }
}

module.exports = new Rule;
