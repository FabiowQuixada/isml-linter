const path      = require('path');
const Constants = require('./Constants');
const rootPath  = Constants.clientIsmlLinterDir;
const fs        = require('fs');

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

const createClientDir = (dirName, dirPath = rootPath) => {
    if (!fs.existsSync(path.join(dirPath, dirName))) {
        fs.mkdirSync(path.join(dirPath, dirName));
    }
};

const deleteDirectoryRecursively = dirPath => {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach( file => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteDirectoryRecursively(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(dirPath);

        return true;
    }

    return false;
};

const fileExists = filePath => fs.existsSync(filePath);

module.exports = {
    saveToJsonFile,
    fileExists,
    createDirIfDoesNotExist,
    deleteFile,
    deleteDirectoryRecursively,
    createClientDir
};
