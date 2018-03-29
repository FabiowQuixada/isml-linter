const reqlib = require('app-root-path').require;
const config = reqlib('/src/app/ConfigLoader').load();
const fs = require('fs');

const ruleName = require('path').basename(__filename).slice(0, -3);

module.exports = {
    _this: this,
    name: ruleName,
    title: 'Unbalanced <isif> tag',
    isEnabled: () => config.enabledRules.indexOf(ruleName) !== -1,
    check: function(fileName, parser) {
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
            parser.addError(that.title, simpleFileName, error.line, error.lineNumber);
        });

        return unbalancedTags.length > 0;
    }
};
