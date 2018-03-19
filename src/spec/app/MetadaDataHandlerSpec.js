const reqlib = require('app-root-path').require;
const MetadataHandler = reqlib('/src/app/MetadataHandler');
const FileUtils = reqlib('/src/app/FileUtils');
const SpecHelper = reqlib('/src/spec/SpecHelper');
const Constants = reqlib('/src/app/Constants');

const specTempDir = Constants.specTempDir;
const metadataFilePath = Constants.specMetadataFilePath;
const reportFileName = Constants.reportFileName;

describe('MetadataHandler', () => {
    beforeEach(() => {
        SpecHelper.cleanTempDirectory();
    });

    afterEach(() => {
        SpecHelper.cleanTempDirectory();
    });

    it('creates a metadata file if does not exist', () => {
        FileUtils.saveToJsonFile(specTempDir, reportFileName, baseReportFileContent);
        MetadataHandler.run(specTempDir, specTempDir);

        expect(FileUtils.fileExists(metadataFilePath)).toBe(true);
    });

    it('copies report file data to a metadata file if does not exist', () => {
        // TODO
        // FileUtils.saveToJsonFile(specTempDir, reportFileName, baseReportFileContent);
        // MetadataHandler.run(specTempDir, specTempDir);

        // const metadataFile = reqlib(metadataFilePath);

        // expect(metadataFile).toEqual(baseReportFileContent);
    });

    it('updates the metadata single rule if there are fewer errors', () => {
        // TODO
        // FileUtils.saveToJsonFile(specTempDir, metadataFileName, baseCompiledOutputFileContent);
        // FileUtils.saveToJsonFile(specTempDir, compiledOutputFileName, compiledOutputWithLessErrorsInASingleRule);

        // MetadataHandler.run(specTempDir, specTempDir);

        // const metadataFile = reqlib(`/${specTempDir}${metadataFileName}`);

        // expect(metadataFile).toEqual(expectedUpdatedMetadataResult);
    });

    it('prints the errors not registered in the metadata file', () => {
        // TODO
    });
});

const baseReportFileContent = {
    'errors': {
        'Direct call to the "dw" package': 72,
        'Wrap expression in <isprint> tag': 90,
    }
};
