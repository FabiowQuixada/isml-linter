const RulesHolder = require('./RulesHolder');

module.exports = {
    parse: (fileName, ResultHolder) => {
        const lineArray = require('fs').readFileSync(fileName, 'utf-8').split('\n').filter(Boolean);
        const simpleFileName = fileName.substring(fileName.indexOf('default/') + 7);

        lineArray.forEach( (line, lineNumber) => {
            RulesHolder.rules.forEach( rule => {
                if (rule.isBroken(line)) {
                    ResultHolder.addError(rule.title, simpleFileName, line, lineNumber);
                }
            });
        });
    }
};
