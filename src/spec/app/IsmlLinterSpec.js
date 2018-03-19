const reqlib = require('app-root-path').require;
const IsmlLinter = reqlib('/src/app/IsmlLinter');
const FileUtils = reqlib('/src/app/FileUtils');
const SpecHelper = reqlib('/src/spec/SpecHelper');
const Constants = reqlib('/src/app/Constants');

const ismlSpecDir = Constants.ismlLinterSpecDir;
const specTempDir = Constants.specTempDir;
const outputFilePath = Constants.specOutputFilePath;
const reportFilePath = Constants.specReportFilePath;
const metadataFilePath = Constants.specMetadataFilePath;

describe('IsmlLinter', () => {
    beforeEach(() => {
        SpecHelper.cleanTempDirectory();
    });

    afterEach(() => {
        SpecHelper.cleanTempDirectory();
    });

    it('lints ISML files in a given directory', () => {
        IsmlLinter.lint(ismlSpecDir);

        expect(IsmlLinter.getOutput()).toEqual(expectedResult);
    });

    it('saves result to an output file', () => {
        IsmlLinter.lint(ismlSpecDir);
        IsmlLinter.export(specTempDir, specTempDir);

        expect(FileUtils.fileExists(outputFilePath)).toBe(true);
    });

    it('saves compiled result to a report file', () => {
        IsmlLinter.lint(ismlSpecDir);
        IsmlLinter.export(specTempDir, specTempDir);

        expect(FileUtils.fileExists(reportFilePath)).toBe(true);
    });

    it('saves compiled result to a metadata file', () => {
        IsmlLinter.lint(ismlSpecDir);
        IsmlLinter.export(specTempDir, specTempDir);

        expect(FileUtils.fileExists(metadataFilePath)).toBe(true);
    });
});

const expectedResult = {
    'errors': {
        'Use class "hidden"': {
            'ec/templates/isml_linter/sample_file_1.isml': [
                'Line 0: <div style="display: none;">${addToCartUrl}</div>'
            ]
        },
        'Wrap expression in <isprint> tag': {
            'ec/templates/isml_linter/sample_file_1.isml': [
                'Line 0: <div style="display: none;">${addToCartUrl}</div>'
            ],
            'ec/templates/isml_linter/sample_file_2.isml': [
                'Line 0: ${URLUtils.https(\'Reorder-ListingPage\')}'
            ]
        }
    }
};
