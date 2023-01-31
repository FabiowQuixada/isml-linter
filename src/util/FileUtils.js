const path        = require('path');
const Constants   = require('./../Constants');
const rootPath    = Constants.clientIsmlLinterDir;
const fs          = require('fs');
const ConfigUtils = require('./ConfigUtils');

const saveToJsonFile = (filePath, fileName, content) => {
    createDirIfDoesNotExist(filePath);
    const fullPath = path.join(filePath, fileName);

    fs.writeFileSync(fullPath, JSON.stringify(content, null, 4));
};

const saveToFile = (filePath, fileName, content) => {
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
        const fileArray = fs.readdirSync(dirPath);

        for (let i = 0; i < fileArray.length; i++) {
            const file    = fileArray[i];
            const curPath = path.join(dirPath, file);

            if (fs.lstatSync(curPath).isDirectory()) {
                deleteDirectoryRecursively(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        }

        fs.rmdirSync(dirPath);

        return true;
    }

    return false;
};

const shouldBeIgnored = filePath => {
    const config            = ConfigUtils.load();
    const formattedFilePath = filePath.replaceAll('\\', '/');

    return !!(config.ignore && config.ignore.some( ignoredPath => {
        return formattedFilePath.indexOf(ignoredPath) >= 0;
    }));
};

const fileExists = filePath => fs.existsSync(filePath);

module.exports.saveToFile                 = saveToFile;
module.exports.saveToJsonFile             = saveToJsonFile;
module.exports.fileExists                 = fileExists;
module.exports.createDirIfDoesNotExist    = createDirIfDoesNotExist;
module.exports.deleteFile                 = deleteFile;
module.exports.deleteDirectoryRecursively = deleteDirectoryRecursively;
module.exports.createClientDir            = createClientDir;
module.exports.shouldBeIgnored            = shouldBeIgnored;
