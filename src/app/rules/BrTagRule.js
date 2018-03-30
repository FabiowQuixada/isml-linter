const reqlib = require('app-root-path').require;
const config = reqlib('/src/app/ConfigLoader').load();
const fs = require('fs');

const ruleName = require('path').basename(__filename).slice(0, -3);

module.exports = {
    name: ruleName,
    title: 'Avoid using <br/> tags',
    isEnabled: () => config.enabledRules.indexOf(ruleName) !== -1,
    isBroken: line => line.indexOf('<br') !== -1,
    check: function(fileName, parser) {
        const that = this;
        const lineArray = fs.readFileSync(fileName, 'utf-8').split('\n');
        const simpleFileName = fileName.substring(fileName.indexOf('default/') + 7);
        let isBroken = false;

        lineArray.forEach( (line, lineNumber) => {
            if (that.isBroken(line)) {
                parser.addError(that.title, simpleFileName, line, lineNumber);
                isBroken = true;
            }
        });

        return isBroken;
    }
};
