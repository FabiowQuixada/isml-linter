const path = require('path');
const Constants = require('./Constants');
const rootPath = Constants.clientIsmlLinterDir;
const fs = require('fs');

const saveToJsonFile = (filePath, fileName, content) => {
    createDirIfDoesNotExist(filePath);
    const fullPath = path.join(filePath, fileName);

    fs.writeFileSync(fullPath, JSON.stringify(content, null, 4));
};

const deleteFile = filePath => {
    if (fileExists(filePath)) {
        fs.unlinkSync(path.join(filePath));
    }
};

const createDirIfDoesNotExist = dirPath => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
};

const createClientRootDir = () => {
    if (!fs.existsSync(rootPath)) {
        fs.mkdirSync(rootPath);
    }
};

const createClientDir = dirName => {
    if (!fs.existsSync(path.join(rootPath, dirName))) {
        fs.mkdirSync(path.join(rootPath, dirName));
    }
};

const deleteDirectoryRecursively = dirPath => {
    if (fs.existsSync(path.join(dirPath))) {
        deleteDirRecursively(path.join(dirPath));
    }
};

const deleteDirRecursively = dirPath => {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach( file => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteDirRecursively(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(dirPath);
    }
};

const fileExists = filePath => fs.existsSync(filePath);

module.exports = {
    saveToJsonFile,
    fileExists,
    createDirIfDoesNotExist,
    deleteFile,
    deleteDirectoryRecursively,
    createClientRootDir,
    createClientDir
};
