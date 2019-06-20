const path       = require('path');
const SpecHelper = require('../../SpecHelper');
const Constants  = require('../../../src/app/Constants');
const FileUtils  = require('../../../src/app/util/FileUtils');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {
    const specTempDir  = Constants.specTempDir;
    const fileName     = 'sample.json';
    const content      = {'key': 'some value'};
    const fileFullPath = path.join(specTempDir, fileName);

    beforeEach(() => {
        FileUtils.createDirIfDoesNotExist(specTempDir);
        FileUtils.deleteFile(fileFullPath);
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('saves content to json file', () => {
        FileUtils.saveToJsonFile(specTempDir, fileName, content);

        expect(require(fileFullPath)).toEqual(content);
    });

    it('creates a parent directory if it does not exist to the json file', () => {
        FileUtils.deleteDirectoryRecursively(specTempDir);

        FileUtils.saveToJsonFile(specTempDir, fileName, content);

        expect(FileUtils.fileExists(specTempDir)).toEqual(true);
    });

    it('checks if a file exists', () => {
        FileUtils.saveToJsonFile(specTempDir, fileName, content);

        expect(FileUtils.fileExists(specTempDir)).toBe(true);
    });

    it('checks if a file does not exists', () => {
        expect(FileUtils.fileExists(fileFullPath)).toBe(false);
    });

    it('deletes a file', () => {
        FileUtils.saveToJsonFile(specTempDir, fileName, content);
        FileUtils.deleteFile(fileFullPath);

        expect(FileUtils.fileExists(fileFullPath)).toBe(false);
    });

    it('deletes a directory', () => {
        FileUtils.deleteDirectoryRecursively(specTempDir);

        expect(FileUtils.fileExists(specTempDir)).toBe(false);
    });

    it('deletes a directory recursively', () => {
        FileUtils.createDirIfDoesNotExist(specTempDir);
        FileUtils.createDirIfDoesNotExist(path.join(specTempDir, 'innerDir'));
        FileUtils.deleteDirectoryRecursively(specTempDir);

        expect(FileUtils.fileExists(specTempDir)).toBe(false);
    });

    it('does nothing when trying to delete a non-existing directory', () => {
        const result = FileUtils.deleteDirectoryRecursively('some_nonexisting_directory_name');

        expect(result).toBe(false);
    });
});
