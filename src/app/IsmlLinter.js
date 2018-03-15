const readDir = require('readdir');
const FileParser = require('./FileParser');
const ResultHolder = require('./ResultHolder');
const MetadataHandler = require('./MetadataHandler');

const lint = dir => {
    const filesArray = readDir.readSync(dir, ['**.isml']);

    filesArray.forEach( fileName => {
        FileParser.parse(`${dir}${fileName}`, ResultHolder);
    });

    ResultHolder.saveToFile();
    ResultHolder.exportReport();
    MetadataHandler.run();
};

module.exports = {
    lint
};
