const reqlib = require('app-root-path').require;
const config = reqlib('/config.json');
const MetadataHandler = reqlib('/src/app/MetadataHandler');
const FileUtils = reqlib('/src/app/FileUtils');
const SpecHelper = reqlib('/src/spec/SpecHelper');
const Constants = reqlib('/src/app/Constants');

const specTempDir = Constants.specTempDir;
const metadataFilePath = Constants.specMetadataFilePath;
const compiledOutputFileName = Constants.compiledOutputFileName;

describe('MetadataHandler', () => {
    beforeEach(() => {
        SpecHelper.cleanTempDirectory();
    });

    afterEach(() => {
        SpecHelper.cleanTempDirectory();
    });

    it('creates a metadata file if does not exist', () => {
        FileUtils.saveToJsonFile(specTempDir, config.file.report, baseReportFileContent);
        MetadataHandler.run(config.dir.specTemp, config.dir.specTemp);

        expect(FileUtils.fileExists(`${specTempDir}${config.file.metadata}`)).toBe(true);
    });

    it('copies report file data to a metadata file if does not exist', () => {
        // TODO
        // FileUtils.saveToJsonFile(specTempDir, config.file.report, baseReportFileContent);
        // MetadataHandler.run(config.dir.specTemp, config.dir.specTemp);

        // const metadataFile = reqlib(`/${config.dir.specTemp}${config.file.metadata}`);

        // expect(metadataFile).toEqual(baseReportFileContent);
    });

    it('updates the metadata single rule if there are fewer errors', () => {
        // TODO
        // FileUtils.saveToJsonFile(specTempDir, metadataFileName, baseCompiledOutputFileContent);
        // FileUtils.saveToJsonFile(specTempDir, compiledOutputFileName, compiledOutputWithLessErrorsInASingleRule);

        // MetadataHandler.run(config.dir.specTemp, config.dir.specTemp);

        // const metadataFile = reqlib(`/${config.dir.specTemp}${config.file.metadata}`);

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
