const path                 = require('path');
const FileParser           = require('../../app/FileParser');
const SpecHelper           = require('../SpecHelper');
const Constants            = require('../../app/Constants');
const NoIsscriptRule       = require('../../app/rules/line_by_line/no-isscript');
const NoSpaceOnlyLinesRule = require('../../app/rules/line_by_line/no-space-only-lines');
const NoInlineStyleRule    = require('../../app/rules/line_by_line/no-inline-style');
const NoRequireInLoopRule  = require('../../app/rules/tree/no-require-in-loop');
const NoHardcodeRule       = require('../../app/rules/tree/no-hardcode');

const filePath      = path.join(Constants.fileParserSpecDir, 'template_0.isml');
const ptFilePath    = path.join(Constants.fileParserSpecDir, 'pt_template_0.isml');
const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('correctly parses a given ISML file', () => {
        const result = FileParser.parse(filePath);

        expect(result).not.toEqual({});
    });

    it('ignores disabled rules', () => {
        const result       = FileParser.parse(filePath);
        let ruleWasChecked = false;

        Object.keys(result.errors).forEach( rule => {
            if (rule === NoIsscriptRule.description) {
                ruleWasChecked = true;
            }
        });

        expect(ruleWasChecked).toBe(false);
    });

    it('checks non-disabled rules', () => {
        const result       = FileParser.parse(filePath);
        let ruleWasChecked = false;

        Object.keys(result.errors).forEach( rule => {
            if (rule === NoInlineStyleRule.description) {
                ruleWasChecked = true;
            }
        });

        expect(ruleWasChecked).toBe(true);
    });

    it('results in a json file', () => {
        const actualResult   = FileParser.parse(filePath);
        const expectedResult = expectedResultObj(FileParser.ENTRY_TYPES.ERROR);

        expect(actualResult).toEqual(expectedResult);
    });

    it('ignores "pt_"-named templates for no-isscript (line) rule', () => {
        const actualResult = FileParser.parse(ptFilePath);

        expect(actualResult.errors[NoIsscriptRule.description]).toEqual(undefined);
        expect(actualResult.errors[NoSpaceOnlyLinesRule.description]).not.toEqual(undefined);
    });

    it('ignores "pt_"-named templates for no-require-in-loop (tree) rule', () => {
        const actualResult = FileParser.parse(ptFilePath);

        expect(actualResult.errors[NoRequireInLoopRule.description]).toEqual(undefined);
        expect(actualResult.errors[NoHardcodeRule.description]).not.toEqual(undefined);
    });
});

const expectedResultObj = type => {
    const result = {};
    result[type] = {};

    const EnforceIsprintRule = require('../../app/rules/line_by_line/enforce-isprint');
    const NoInlineStyleRule  = require('../../app/rules/line_by_line/no-inline-style');

    const inlineStyleRuleDesc = NoInlineStyleRule.description;
    const isprintRuleDesc     = EnforceIsprintRule.description;

    const line = '<div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>';

    const isprintOccurrence = {
        line,
        lineNumber: 3,
        columnStart: 136,
        length: 15
    };

    const styleOccurrence = {
        line,
        lineNumber: 3,
        columnStart: 113,
        length: 5
    };

    result[type][isprintRuleDesc] = [];
    result[type][isprintRuleDesc].push(isprintOccurrence);

    result[type][inlineStyleRuleDesc] = [];
    result[type][inlineStyleRuleDesc].push(styleOccurrence);

    return result;
};
