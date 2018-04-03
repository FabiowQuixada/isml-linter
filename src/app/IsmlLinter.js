const readDir = require('readdir');
const FileParser = require('./FileParser');
const MetadataHandler = require('./MetadataHandler');
const path = require('path');

const lint = (linter, dir) => {
    FileParser.cleanOutput();
    const filesArray = readDir.readSync(dir, ['**.isml']);

    filesArray.forEach( fileName => {
        FileParser.parse(path.join(dir, fileName));
    });

    linter.fileParser = FileParser;
};

const exportResultToFile = (linter, outputDir, metaDir) => {
    linter.fileParser.saveToFile(outputDir);
    linter.fileParser.compileOutput(outputDir);
    MetadataHandler.updateMatadataFile(outputDir, metaDir);
};

module.exports = {
    lint: dir => { lint(this, dir); },
    getOutput: () => this.fileParser.getOutput(),
    export: (outputDir, metaDir) => { exportResultToFile(this, outputDir, metaDir); }
};
