const readDir = require('readdir');
const FileParser = require('./FileParser');
const ResultHolder = require('./ResultHolder');
const MetadataHandler = require('./MetadataHandler');

const lint = (linter, dir) => {
    ResultHolder.cleanOutput();
    const filesArray = readDir.readSync(dir, ['**.isml']);

    filesArray.forEach( fileName => {
        FileParser.parse(`${dir}${fileName}`, ResultHolder);
    });

    linter.resultHolder = ResultHolder;
};

const exportResultToFile = (linter, outputDir, metaDir) => {
    linter.resultHolder.saveToFile(outputDir);
    linter.resultHolder.exportReport(outputDir);
    MetadataHandler.run(outputDir, metaDir);
};

module.exports = {
    lint: dir => { lint(this, dir); },
    getOutput: () => this.resultHolder.getOutput(),
    export: (outputDir, metaDir) => { exportResultToFile(this, outputDir, metaDir); }
};
