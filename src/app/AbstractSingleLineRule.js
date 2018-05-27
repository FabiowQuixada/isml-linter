const fs = require('fs');
const AbstractRule = require('./AbstractRule');

class AbstractSingleLineRule extends AbstractRule {

    check(fileName, parser) {
        const that = this;
        const lineArray = fs.readFileSync(fileName, 'utf-8').split('\n');
        const simpleFileName = fileName.substring(fileName.indexOf('default') + 8);
        let isBroken = false;

        lineArray.forEach( (line, lineNumber) => {
            if (that.isBroken(line)) {
                parser.addError(that.description, simpleFileName, line, lineNumber);
                isBroken = true;
            }
        });

        return isBroken;
    }

    isMatch(line, string) {
        const regEx = new RegExp(string + '(\r)*', 'gi');
        return line.match(regEx);
    }
}

module.exports = AbstractSingleLineRule;
