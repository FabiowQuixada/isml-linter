const path                 = require('path');
const FileUtils            = require('../../app/FileUtils');
const SpecHelper           = require('../SpecHelper');
const LinterResultExporter = require('../../app/LinterResultExporter');
const Constants            = require('../../app/Constants');
const NoInlineStyleRule    = require('../../app/rules/line_by_line/no-inline-style');
const EnforceIsprintRule   = require('../../app/rules/line_by_line/enforce-isprint');
const NoTrailingSpacesRule = require('../../app/rules/line_by_line/no-trailing-spaces');

const specTempDir            = Constants.specTempDir;
const outputFilePath         = Constants.specOutputFilePath;
const compiledOutputFilePath = Constants.specCompiledOutputFilePath;
const targetObjName          = SpecHelper.getTargetObjName(__filename);
const UNPARSEABLE            = Constants.UNPARSEABLE;

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
        const inlineRuleDesc    = NoInlineStyleRule.description;
        const isprintRuleDesc   = EnforceIsprintRule.description;
        const blankLineRuleDesc = NoTrailingSpacesRule.description;
        const outputErrorArray  = [];
        const expectedResult    = [inlineRuleDesc, blankLineRuleDesc, isprintRuleDesc];

        const orderedResult = LinterResultExporter.export(specTempDir, getUnorderedJsonData());

        Object.keys(orderedResult.errors).forEach( error => outputErrorArray.push(error));

        expect(outputErrorArray).toEqual(expectedResult);
    });

    it('sets the total quantity of errors to the compiled output', () => {
        LinterResultExporter.export(specTempDir, getJsonData());

        const compiledOutputFile = require(path.join(compiledOutputFilePath)).total;

        expect(compiledOutputFile).toEqual(2);
    });

    it('lists unparseable templates separately', () => {
        const result = LinterResultExporter.export(specTempDir, getJsonData());

        expect(result[UNPARSEABLE]).toEqual(1);
    });
});

const getUnorderedJsonData = () => {

    const type   = require('../../app/FileParser').ENTRY_TYPES.ERROR;
    const result = {};
    result[type] = {};

    const inlineStyleRuleDesc    = NoInlineStyleRule.description;
    const isprintRuleDesc        = EnforceIsprintRule.description;
    const spacesOnlyLineRuleDesc = NoTrailingSpacesRule.description;

    const filePath = path.join(...'/file_parser/sample_file.isml'.split( '/' ));
    const line     = {
        lineNumber: 3,
        line: ' <div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>'
    };

    result[type][spacesOnlyLineRuleDesc]           = {};
    result[type][spacesOnlyLineRuleDesc][filePath] = [];
    result[type][spacesOnlyLineRuleDesc][filePath].push(line);

    result[type][isprintRuleDesc]           = {};
    result[type][isprintRuleDesc][filePath] = [];
    result[type][isprintRuleDesc][filePath].push(line);

    result[type][inlineStyleRuleDesc]           = {};
    result[type][inlineStyleRuleDesc][filePath] = [];
    result[type][inlineStyleRuleDesc][filePath].push(line);

    return result;
};

const getJsonData = () => {

    const type   = require('../../app/FileParser').ENTRY_TYPES.ERROR;
    const result = {};
    result[type] = {};

    const inlineStyleRuleDesc = NoInlineStyleRule.description;
    const isprintRuleDesc     = EnforceIsprintRule.description;

    const filePath = path.join(...'/file_parser/sample_file.isml'.split( '/' ));
    const line     = {
        line: ' <div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>',
        lineNumber: 3
    };

    const invalidTemplate = {
        'template_0.isml': 'Invalid ISML DOM :: Unbalanced <isif> element'
    };

    result[type][isprintRuleDesc]           = {};
    result[type][isprintRuleDesc][filePath] = [];
    result[type][isprintRuleDesc][filePath].push(line);

    result[type][inlineStyleRuleDesc]           = {};
    result[type][inlineStyleRuleDesc][filePath] = [];
    result[type][inlineStyleRuleDesc][filePath].push(line);

    result[UNPARSEABLE] = [];
    result[UNPARSEABLE].push(invalidTemplate);

    return result;
};
