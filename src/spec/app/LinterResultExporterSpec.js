const path = require('path');
const FileUtils = require('../../app/FileUtils');
const SpecHelper = require('../SpecHelper');
const LinterResultExporter = require('../../app/LinterResultExporter');
const Constants = require('../../app/Constants');
const StyleAttributeRule = require('../../app/rules/StyleAttributeRule');
const IsprintTagRule = require('../../app/rules/IsprintTagRule');
const SpacesOnlyLineRule = require('../../app/rules/SpacesOnlyLineRule');

const specTempDir = Constants.specTempDir;
const outputFilePath = Constants.specOutputFilePath;
const compiledOutputFilePath = Constants.specCompiledOutputFilePath;
const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('saves result to an output file', () => {
        LinterResultExporter.export(specTempDir, getJsonData());

        expect(FileUtils.fileExists(outputFilePath)).toBe(true);
    });

    it('saves compiled result to an output file', () => {
        LinterResultExporter.export(specTempDir, getJsonData());

        expect(FileUtils.fileExists(compiledOutputFilePath)).toBe(true);
    });

    it('orders output errors by rule description', () => {
        const inlineRuleDesc = StyleAttributeRule.description;
        const isprintRuleDesc = IsprintTagRule.description;
        const blankLineRuleDesc = SpacesOnlyLineRule.description;
        const outputErrorArray = [];
        const expectedResult = [inlineRuleDesc, blankLineRuleDesc, isprintRuleDesc];

        const orderedResult = LinterResultExporter.export(specTempDir, getUnorderedJsonData());

        Object.keys(orderedResult.errors).forEach( error => outputErrorArray.push(error));

        expect(outputErrorArray).toEqual(expectedResult);
    });

    it('sets the total quantity of errors to the compiled output', () => {
        LinterResultExporter.export(specTempDir, getJsonData());

        const compiledOutputFile = require(path.join(compiledOutputFilePath)).total;

        expect(compiledOutputFile).toEqual(2);
    });
});

const getUnorderedJsonData = () => {

    const type = require('../../app/FileParser').ENTRY_TYPES.ERROR;
    const result = {};
    result[type] = {};

    const inlineStyleRuleDesc = StyleAttributeRule.description;
    const isprintRuleDesc = IsprintTagRule.description;
    const spacesOnlyLineRuleDesc = SpacesOnlyLineRule.description;

    const filePath = path.join(...'/file_parser/sample_file.isml'.split( '/' ));
    const line = {
        lineNumber: 3,
        line: ' <div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>'
    };

    result[type][spacesOnlyLineRuleDesc] = {};
    result[type][spacesOnlyLineRuleDesc][filePath] = [];
    result[type][spacesOnlyLineRuleDesc][filePath].push(line);

    result[type][isprintRuleDesc] = {};
    result[type][isprintRuleDesc][filePath] = [];
    result[type][isprintRuleDesc][filePath].push(line);

    result[type][inlineStyleRuleDesc] = {};
    result[type][inlineStyleRuleDesc][filePath] = [];
    result[type][inlineStyleRuleDesc][filePath].push(line);

    return result;
};

const getJsonData = () => {

    const type = require('../../app/FileParser').ENTRY_TYPES.ERROR;
    const result = {};
    result[type] = {};

    const inlineStyleRuleDesc = StyleAttributeRule.description;
    const isprintRuleDesc = IsprintTagRule.description;

    const filePath = path.join(...'/file_parser/sample_file.isml'.split( '/' ));
    const line = {
        line: ' <div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>',
        lineNumber: 3
    };

    result[type][isprintRuleDesc] = {};
    result[type][isprintRuleDesc][filePath] = [];
    result[type][isprintRuleDesc][filePath].push(line);

    result[type][inlineStyleRuleDesc] = {};
    result[type][inlineStyleRuleDesc][filePath] = [];
    result[type][inlineStyleRuleDesc][filePath].push(line);

    return result;
};
