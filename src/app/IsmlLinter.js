const readDir = require('readdir');
const FileParser = require('./FileParser');
const path = require('path');
const LinterResultExporter = require('./LinterResultExporter');
const Constants = require('./Constants');
const appRoot = require('app-root-path');

const Linter = {};

Linter.run = function(dir = appRoot.toString()) {

    const fs = require('fs');
    const filesArray = readDir
        .readSync(dir, ['**.isml'])
        .filter( file => file.indexOf('node_modules') === -1 );

    this.result = {};
    this.result.errors = {};
    const that = this;

    filesArray.forEach( filePath => {
        const fileContent = fs.readFileSync(path.join(dir, filePath), 'utf-8');
        const output = FileParser.parse(fileContent);

        for (const rule in output.errors) {
            that.result.errors[rule] = that.result.errors[rule] || {};
            that.result.errors[rule][filePath] = output.errors[rule];
        }
    });

    return this.getOutput();
};

Linter.export = function(outputDir = Constants.clientOutputDir) {
    LinterResultExporter.export(outputDir, this.result);
};

Linter.getOutput = function() { return this.result; };

module.exports = Linter;
