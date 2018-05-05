const path = require('path');
const IsmlLinter = require('../../app/IsmlLinter');
const FileUtils = require('../../app/FileUtils');
const SpecHelper = require('../SpecHelper');
const Constants = require('../../app/Constants');
const SpacesOnlyLineRule = require('../../app/rules/SpacesOnlyLineRule');
const StyleAttributeRule = require('../../app/rules/StyleAttributeRule');
const IsprintTagRule = require('../../app/rules/IsprintTagRule');

const ismlSpecDir = Constants.ismlLinterSpecDir;
const specTempDir = Constants.specTempDir;
const outputFilePath = Constants.specOutputFilePath;
const compiledOutputFilePath = Constants.specCompiledOutputFilePath;
//const metadataFilePath = Constants.specMetadataFilePath;
const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('lints ISML files in a given directory', () => {
        IsmlLinter.lint(ismlSpecDir);

        expect(IsmlLinter.getOutput()).toEqual(expectedResultObj('errors'));
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

    it('ignores files under the node_modules/ directory', () => {
        IsmlLinter.lint(ismlSpecDir);

        const output = JSON.stringify(IsmlLinter.getOutput());

        expect(output.indexOf('node_modules')).toBe(-1);
    });

    //it('saves compiled result to a metadata file', () => {
    //    IsmlLinter.lint(ismlSpecDir);
    //    IsmlLinter.export(specTempDir, specTempDir);
    //
    //    expect(FileUtils.fileExists(metadataFilePath)).toBe(true);
    //});

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

const expectedResultObj = type => {
    const result = {};
    result[type] = {};

    const inlineStyleRuleDesc = StyleAttributeRule.description;
    const blankLineRuleDesc = SpacesOnlyLineRule.description;
    const isprintRuleDesc = IsprintTagRule.description;

    const file0Path = path.join(...'/isml_linter/sample_file_1.isml'.split( '/' ));
    const file1Path = path.join(...'/isml_linter/sample_file_2.isml'.split( '/' ));
    const line0 = 'Line 1: <div style="display: none;">${addToCartUrl}</div>';
    const line1 = 'Line 2: ';
    const line2 = 'Line 1: <div style="display: none;">${addToCartUrl}</div>';
    const line3 = 'Line 1: ${URLUtils.https(\'Reorder-ListingPage\')}';

    result[type][inlineStyleRuleDesc] = {};
    result[type][inlineStyleRuleDesc][file0Path] = [];
    result[type][inlineStyleRuleDesc][file0Path].push(line0);

    result[type][blankLineRuleDesc] = {};
    result[type][blankLineRuleDesc][file0Path] = [];
    result[type][blankLineRuleDesc][file0Path].push(line1);

    result[type][isprintRuleDesc] = {};
    result[type][isprintRuleDesc][file0Path] = [];
    result[type][isprintRuleDesc][file0Path].push(line2);
    result[type][isprintRuleDesc][file1Path] = [];
    result[type][isprintRuleDesc][file1Path].push(line3);

    return result;
};
