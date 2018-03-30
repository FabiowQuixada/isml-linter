const path = require('path');
const rootPath = require('app-root-path').toString();
const fs = require('fs');

const saveToJsonFile = (filePath, fileName, content) => {
    createDirIfDoesNotExist(filePath);
    const fullPath = path.join(rootPath, filePath, fileName);

    fs.writeFileSync(fullPath, JSON.stringify(content, null, 4));
};

const deleteFile = filePath => {
    if (fileExists(filePath)) {
        fs.unlinkSync(path.join(rootPath, filePath));
    }
};

const createDirIfDoesNotExist = dirPath => {
    if (!fs.existsSync(path.join(rootPath, dirPath))) {
        fs.mkdirSync(path.join(rootPath, dirPath));
    }
};

const deleteDirectoryRecursively = dirPath => {
    if (fs.existsSync(path.join(rootPath, dirPath))) {
        deleteDirRecursively(path.join(rootPath, dirPath));
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

const fileExists = filePath => fs.existsSync(path.join(rootPath, filePath));

module.exports = {
    saveToJsonFile,
    fileExists,
    createDirIfDoesNotExist,
    deleteFile,
    deleteDirectoryRecursively
};
