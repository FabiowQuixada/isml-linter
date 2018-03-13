const fs = require('fs');
const ERROR = 'errors';
const WARNING = 'warnings';
const INFO = 'info';
const outputFile = 'output.json';
const reportFile = 'report.json';

const formattedLine = (line, lineNumber) => `Line ${lineNumber}: ${line.trim()}`;
const saveToFile = (targetFile, content) => {
    fs.writeFileSync(targetFile, JSON.stringify(content, null, 4));
};

const add = (that, type, rule, fileName, line, lineNumber) => {
    that.output = that.output || {};
    that.output[type] = that.output[type] || {};
    that.output[type][rule] = that.output[type][rule] || {};
    that.output[type][rule][fileName] = that.output[type][rule][fileName] || [];
    that.output[type][rule][fileName].push(formattedLine(line, lineNumber));
};

const exportReport = content => {
    if (content) {
        let report = {};

        Object.keys(content).forEach( type => {

            report[type] = report[type] || {};

            Object.keys(content[type]).forEach( error => {
                report[type][error] = 0;

                Object.keys(content[type][error]).forEach( file => {
                    Object.keys(content[type][error][file]).forEach( () => {
                        report[type][error] += 1;
                    });
                });

            });
        });

        saveToFile(reportFile, report);
    }
};

module.exports = {
    addError    : (rule, file, line, lineNumber) => add(this, ERROR,   rule, file, line, lineNumber),
    addWarning  : (rule, file, line, lineNumber) => add(this, WARNING, rule, file, line, lineNumber),
    addInfo     : (rule, file, line, lineNumber) => add(this, INFO,    rule, file, line, lineNumber),
    cleanOutput : () => this.output = {},
    getOutput   : () => this.output || {},
    saveToFile  : () => { saveToFile(outputFile, this.output); },
    exportReport: () => { exportReport(this.output); }
};
