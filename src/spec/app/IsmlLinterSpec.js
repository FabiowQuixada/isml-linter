const IsmlLinter = require('../../app/IsmlLinter');
const FileUtils = require('../../app/FileUtils');
const SpecHelper = require('../SpecHelper');
const Constants = require('../../app/Constants');

const ismlSpecDir = Constants.ismlLinterSpecDir;
const specTempDir = Constants.specTempDir;
const outputFilePath = Constants.specOutputFilePath;
const compiledOutputFilePath = Constants.specCompiledOutputFilePath;
const metadataFilePath = Constants.specMetadataFilePath;

describe('IsmlLinter', () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
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

    it('saves compiled result to an output file', () => {
        IsmlLinter.lint(ismlSpecDir);
        IsmlLinter.export(specTempDir, specTempDir);

        expect(FileUtils.fileExists(compiledOutputFilePath)).toBe(true);
    });

    it('saves compiled result to a metadata file', () => {
        IsmlLinter.lint(ismlSpecDir);
        IsmlLinter.export(specTempDir, specTempDir);

        expect(FileUtils.fileExists(metadataFilePath)).toBe(true);
    });

    it('orders output errors by rule description', () => {
        const inlineRuleDesc = SpecHelper.getRule('StyleAttributeRuleSpec').description;
        const isprintRuleDesc = SpecHelper.getRule('IsprintTagRuleSpec').description;
        const blankLineRuleDesc = SpecHelper.getRule('SpacesOnlyLineRuleSpec').description;
        const outputErrorArray = [];
        const expectedResult = [inlineRuleDesc, blankLineRuleDesc, isprintRuleDesc];

        IsmlLinter.lint(ismlSpecDir);

        Object.keys(IsmlLinter.getOutput().errors).forEach( error => outputErrorArray.push(error));

        expect(outputErrorArray).toEqual(expectedResult);
    });
});

const expectedResult = {
    'errors': {
        'Avoid using inline style': {
            '/isml_linter/sample_file_1.isml': [
                'Line 1: <div style="display: none;">${addToCartUrl}</div>'
            ]
        },
        'Line contains only blank spaces' : {
            '/isml_linter/sample_file_1.isml' : [
                'Line 2: '
            ]
        },
        'Wrap expression in <isprint> tag': {
            '/isml_linter/sample_file_1.isml': [
                'Line 1: <div style="display: none;">${addToCartUrl}</div>'
            ],
            '/isml_linter/sample_file_2.isml': [
                'Line 1: ${URLUtils.https(\'Reorder-ListingPage\')}'
            ]
        }
    }
};
