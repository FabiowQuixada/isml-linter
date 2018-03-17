const reqlib = require('app-root-path').require;
const config = reqlib('/config.json');
const IsmlLinter = reqlib('/src/app/IsmlLinter');
const FileUtils = reqlib('/src/app/FileUtils');
const SpecHelper = reqlib('/src/spec/SpecHelper');
const targetDir = config.dir.specLinterTemplate;
const outputFilePath = `${config.dir.specTemp}${config.file.output}`;
const reportFilePath = `${config.dir.specTemp}${config.file.report}`;
const metadataFilePath = `${config.dir.specTemp}${config.file.metadata}`;

describe('IsmlLinter', () => {
    beforeEach(() => {
        SpecHelper.cleanTempDirectory();
    });

    afterEach(() => {
        SpecHelper.cleanTempDirectory();
    });

    it('lints ISML files in a given directory', () => {
        IsmlLinter.lint(targetDir);

        expect(IsmlLinter.getOutput()).toEqual(expectedResult);
    });

    it('saves result to an output file', () => {
        IsmlLinter.lint(targetDir);
        IsmlLinter.export(config.dir.specTemp, config.dir.specTemp);

        expect(FileUtils.fileExists(outputFilePath)).toBe(true);
    });

    it('saves compiled result to a report file', () => {
        IsmlLinter.lint(targetDir);
        IsmlLinter.export(config.dir.specTemp, config.dir.specTemp);

        expect(FileUtils.fileExists(reportFilePath)).toBe(true);
    });

    it('saves compiled result to a metadata file', () => {
        IsmlLinter.lint(targetDir);
        IsmlLinter.export(config.dir.specTemp, config.dir.specTemp);

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
