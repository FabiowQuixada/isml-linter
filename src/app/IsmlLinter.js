const readDir = require('readdir');
const FileParser = require('./FileParser');
//const MetadataHandler = require('./MetadataHandler');
const path = require('path');
const FileUtils = require('./FileUtils');
const Constants = require('./Constants');

const outputFileName = Constants.outputFileName;
const compiledOutputFileName = Constants.compiledOutputFileName;

const Linter = {};

Linter.orderOutputByRuleDescription = function() {
    const orderedOutput = {};

    Object.keys(this.result).sort().forEach( level => {
        orderedOutput[level] = {};

        Object.keys(this.result[level]).sort().forEach( ruleDesc => {
            orderedOutput[level][ruleDesc] = this.result[level][ruleDesc];
        });
    });

    this.result = orderedOutput;
};

Linter.lint = function(dir) {

    const filesArray = readDir
        .readSync(dir, ['**.isml'])
        .filter( file => file.indexOf('node_modules') === -1 );

    this.result = {};
    this.result.errors = {};
    const that = this;

    filesArray.forEach( fileName => {
        const output = FileParser.parse(path.join(dir, fileName));

        for (const rule in output.errors) {
            that.result.errors[rule] = that.result.errors[rule] || {};
            that.result.errors[rule][fileName] = output.errors[rule];
        }
    });

    this.orderOutputByRuleDescription();
};

Linter.export = function(outputDir /**, metaDir */) {
    this.saveToFile(outputDir);
    this.compileOutput(outputDir);
    //MetadataHandler.updateMatadataFile(outputDir, metaDir);
};

Linter.compileOutput = function(dir) {

    const content = this.result;

    if (content) {
        let total = 0;
        const compiledOutput = {};

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

Linter.saveToFile = function(dir) { FileUtils.saveToJsonFile(dir, outputFileName, this.result); };

Linter.getOutput = function() { return this.result; };

module.exports = Linter;
