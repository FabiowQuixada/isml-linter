const reqlib = require('app-root-path').require;
const fs = require('fs');
const FileUtils = reqlib('src/app/FileUtils');
const Constants = reqlib('/src/app/Constants');
const RulesHolder = require('./RulesHolder');

const ERROR = 'errors';
const WARNING = 'warnings';
const INFO = 'info';

const outputFileName = Constants.outputFileName;
const reportFileName = Constants.reportFileName;

const formattedLine = (line, lineNumber) => `Line ${lineNumber+1}: ${line.trim()}`;

const add = (parser, type, rule, fileName, line, lineNumber) => {
    parser.output = parser.output || {};
    parser.output[type] = parser.output[type] || {};
    parser.output[type][rule] = parser.output[type][rule] || {};
    parser.output[type][rule][fileName] = parser.output[type][rule][fileName] || [];
    parser.output[type][rule][fileName].push(formattedLine(line, lineNumber));
};

const parse = (parser, fileName) => {
    const lineArray = fs.readFileSync(fileName, 'utf-8').split('\n').filter(Boolean);
    const simpleFileName = fileName.substring(fileName.indexOf('default/') + 7);

    lineArray.forEach( (line, lineNumber) => {
        RulesHolder.rules.forEach( rule => {
            if (rule.isBroken(line)) {
                addError(parser, rule.title, simpleFileName, line, lineNumber);
            }
        });
    });
};

const exportReport = (dir, content) => {

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

        FileUtils.saveToJsonFile(dir, reportFileName, report);
    }
};

const addError    = (parser, rule, file, line, lineNumber) => add(parser, ERROR,   rule, file, line, lineNumber);
const addWarning  = (parser, rule, file, line, lineNumber) => add(parser, WARNING, rule, file, line, lineNumber);
const addInfo     = (parser, rule, file, line, lineNumber) => add(parser, INFO,    rule, file, line, lineNumber);

const FileParser = {
    parse       : fileName => { parse(this, fileName); },
    cleanOutput : () => this.output = {},
    getOutput   : () => this.output || {},
    saveToFile  : dir => { FileUtils.saveToJsonFile(dir, outputFileName, this.output); },
    exportReport: dir => { exportReport(dir, this.output); }
};

module.exports = FileParser;
