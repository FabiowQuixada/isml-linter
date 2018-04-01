const FileUtils = require('./FileUtils');
const Constants = require('./Constants');
const RulesHolder = require('./RulesHolder');

const ENTRY_TYPES = {
    ERROR: 'errors',
    WARNING: 'warnings',
    INFO: 'info'
};

const outputFileName = Constants.outputFileName;
const compiledOutputFileName = Constants.compiledOutputFileName;

const formattedLine = (line, lineNumber) => `Line ${lineNumber+1}: ${line.trim()}`;

const add = (parser, type, rule, fileName, line, lineNumber) => {
    parser.output = parser.output || {};
    parser.output[type] = parser.output[type] || {};
    parser.output[type][rule] = parser.output[type][rule] || {};
    parser.output[type][rule][fileName] = parser.output[type][rule][fileName] || [];
    parser.output[type][rule][fileName].push(formattedLine(line, lineNumber));
};

const parse = (parser, fileName) => {
    RulesHolder.getEnabledRules().forEach( rule => rule.check(fileName, FileParser) );
};

const compileOutput = (dir, content) => {
    if (content) {
        let total = 0;
        let compiledOutput = {};

        Object.keys(content).forEach( type => {

            compiledOutput[type] = compiledOutput[type] || {};

            Object.keys(content[type]).forEach( error => {
                compiledOutput[type][error] = 0;

                Object.keys(content[type][error]).forEach( file => {
                    Object.keys(content[type][error][file]).forEach( () => {
                        compiledOutput[type][error] += 1;
                        total += 1;
                    });
                });
            });
        });

        compiledOutput.total = total;

        FileUtils.saveToJsonFile(dir, compiledOutputFileName, compiledOutput);
    }
};

const addError = (rule, file, line, lineNumber) => {
    add(this, ENTRY_TYPES.ERROR, rule, file, line, lineNumber);
};

const FileParser = {
    parse       : fileName => { parse(this, fileName); },
    cleanOutput : () => this.output = {},
    getOutput   : () => this.output || {},
    saveToFile  : dir => { FileUtils.saveToJsonFile(dir, outputFileName, this.output); },
    compileOutput: dir => { compileOutput(dir, this.output); },
    addError,
    ENTRY_TYPES
};

module.exports = FileParser;
