const fs = require('fs');
const AbstractRule = require('./AbstractRule');

class AbstractSingleLineRule extends AbstractRule {

    check(fileName, parser) {
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
}

module.exports = AbstractSingleLineRule;
