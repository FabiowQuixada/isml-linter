const reqlib = require('app-root-path').require;
const config = reqlib('/config.json');
const FileUtils = reqlib('/src/app/FileUtils');

describe('FileUtils', () => {
    const filePath = config.dir.specTemp;
    const fileName = 'sample.json';
    const content = {'key': 'some value'};
    const fileFullPath = `${filePath}${fileName}`;

    beforeEach(() => {
        FileUtils.createDirIfDoesNotExist(filePath);
        FileUtils.deleteFile(fileFullPath);
    });

    it('saves content to json file', () => {
        FileUtils.saveToJsonFile(filePath, fileName, content);

        expect(reqlib(fileFullPath)).toEqual(content);
    });

    it('creates a parent directory if it does not exist to the json file', () => {
        FileUtils.deleteDirectory(filePath);

        FileUtils.saveToJsonFile(filePath, fileName, content);

        expect(FileUtils.fileExists(filePath)).toEqual(true);
    });

    it('checks if a file exists', () => {
        FileUtils.saveToJsonFile(filePath, fileName, content);

        expect(FileUtils.fileExists(filePath)).toBe(true);
    });

    it('checks if a file does not exists', () => {
        expect(FileUtils.fileExists(fileFullPath)).toBe(false);
    });

    it('deletes a file', () => {
        FileUtils.saveToJsonFile(filePath, fileName, content);
        FileUtils.deleteFile(fileFullPath);

        expect(FileUtils.fileExists(fileFullPath)).toBe(false);
    });

    it('deletes a directory', () => {
        FileUtils.deleteDirectory(filePath);

        expect(FileUtils.fileExists(filePath)).toBe(false);
    });
});
