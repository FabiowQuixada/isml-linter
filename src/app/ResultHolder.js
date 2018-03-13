const ERROR = 'errors';
const WARNING = 'warnings';
const INFO = 'info';
const outputFile = 'output.json';

const formattedLine = (line, lineNumber) => `Line ${lineNumber}: ${line.trim()}`;
const stringify = output => JSON.stringify(output, null, 4);

const add = (that, type, rule, fileName, line, lineNumber) => {
    that.output = that.output || {};
    that.output[type] = that.output[type] || {};
    that.output[type][rule] = that.output[type][rule] || {};
    that.output[type][rule][fileName] = that.output[type][rule][fileName] || [];
    that.output[type][rule][fileName].push(formattedLine(line, lineNumber));
};

module.exports = {
    addError    : (rule, file, line, lineNumber) => add(this, ERROR,   rule, file, line, lineNumber),
    addWarning  : (rule, file, line, lineNumber) => add(this, WARNING, rule, file, line, lineNumber),
    addInfo     : (rule, file, line, lineNumber) => add(this, INFO,    rule, file, line, lineNumber),
    cleanOutput : () => this.output = {},
    getOutput   : () => this.output || {},
    saveToFile  : () => { require('fs').writeFileSync(outputFile, stringify(this.output)); }
};
