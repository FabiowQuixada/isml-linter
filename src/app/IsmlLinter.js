const readDir = require('readdir');
const FileParser = require('./FileParser');
const ResultHolder = require('./ResultHolder');

const lint = dir => {
    const filesArray = readDir.readSync(dir, ['**.isml']);

    filesArray.forEach( fileName => {
        FileParser.parse(`${dir}${fileName}`, ResultHolder);
    });

    ResultHolder.saveToFile();
};

module.exports = {
    lint
};
