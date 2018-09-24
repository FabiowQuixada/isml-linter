const readDir = require('readdir');
const FileParser = require('./FileParser');
const path = require('path');
const LinterResultExporter = require('./LinterResultExporter');
const Constants = require('./Constants');
const appRoot = require('app-root-path');
const config = require('./ConfigLoader').load();

const Linter = {};

const ignoreFiles = file => {
    if (file.indexOf('node_modules') !== -1) {
        return false;
    }

    if (config.ignore && config.ignore.some( ignorePath => file.indexOf(ignorePath) !== -1)) {
        return false;
    }

    return true;
};

Linter.run = function(dir = appRoot.toString()) {

    const fs = require('fs');
    const filesArray = readDir
        .readSync(dir, ['**.isml'])
        .filter(ignoreFiles);

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
