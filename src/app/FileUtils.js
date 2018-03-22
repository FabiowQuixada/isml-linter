const rootPath = require('app-root-path').toString();
const fs = require('fs');

const saveToJsonFile = (filePath, fileName, content) => {
    createDirIfDoesNotExist(filePath);

    fs.writeFileSync(`${rootPath}/${filePath}${fileName}`, JSON.stringify(content, null, 4));
};

const deleteFile = filePath => {
    if (fileExists(filePath)) {
        fs.unlinkSync(`${rootPath}/${filePath}`);
    }
};

const createDirIfDoesNotExist = dirPath => {
    if (!fs.existsSync(`${rootPath}/${dirPath}`)) {
        fs.mkdirSync(`${rootPath}/${dirPath}`);
    }
};

const deleteDirectoryRecursively = dirPath => {
    if (fs.existsSync(`${rootPath}/${dirPath}`)) {
        deleteDirRecursively(`${rootPath}/${dirPath}`);
    }
};

const deleteDirRecursively = path => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach( file => {
            const curPath = path + '/' + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteDirRecursively(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(path);
    }
};

const fileExists = filePath => fs.existsSync(`${rootPath}/${filePath}`);

module.exports = {
    saveToJsonFile,
    fileExists,
    createDirIfDoesNotExist,
    deleteFile,
    deleteDirectoryRecursively
};
