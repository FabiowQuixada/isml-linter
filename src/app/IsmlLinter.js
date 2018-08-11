const readDir = require('readdir');
const FileParser = require('./FileParser');
const path = require('path');
const LinterResultExporter = require('./LinterResultExporter');

const Linter = {};

Linter.run = function(dir) {

    const filesArray = readDir
        .readSync(dir, ['**.isml'])
        .filter( file => file.indexOf('node_modules') === -1 );

    this.result = {};
    this.result.errors = {};
    const that = this;

    filesArray.forEach( filePath => {
        const output = FileParser.parse(path.join(dir, filePath));

        for (const rule in output.errors) {
            that.result.errors[rule] = that.result.errors[rule] || {};
            that.result.errors[rule][filePath] = output.errors[rule];
        }
    });

    return this.getOutput();
};

Linter.export = function(outputDir) {
    LinterResultExporter.export(outputDir, this.result);
};

Linter.getOutput = function() { return this.result; };

module.exports = Linter;
