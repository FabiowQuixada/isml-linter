const ConfigUtils          = require('../../app/util/ConfigUtils');
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

        ConfigUtils.load({
            rules: {
                'enforce-isprint': {},
                'no-inline-style': {}
            }
        });

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

        ConfigUtils.load({
            rules: {
                'enforce-isprint': {},
                'no-inline-style': {}
            }
        });

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

        ConfigUtils.load({
            rules: {
                'enforce-isprint': {},
                'no-inline-style': {}
            }
        });

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

    const line0 = '<isset name="pageUrl" value="${URLUtils.https(\'Reorder-ListingPage\')}" scope="page"/>';
    const line1 = '<div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>';

    const isprintOccurrence0 = {
        line        : line0,
        lineNumber  : 2,
        globalPos : 30,
        length      : 40,
        rule        : EnforceIsprintRule.name,
        message     : EnforceIsprintRule.description
    };
    const isprintOccurrence1 = {
        line        : line1,
        lineNumber  : 3,
        globalPos : 136,
        length      : 15,
        rule        : EnforceIsprintRule.name,
        message     : EnforceIsprintRule.description
    };

    const styleOccurrence = {
        line        : line1,
        lineNumber  : 3,
        globalPos : 113,
        length      : 5,
        rule        : NoInlineStyleRule.name,
        message     : NoInlineStyleRule.description
    };

    result[type][isprintRuleDesc] = [];
    result[type][isprintRuleDesc].push(isprintOccurrence0);
    result[type][isprintRuleDesc].push(isprintOccurrence1);

    result[type][inlineStyleRuleDesc] = [];
    result[type][inlineStyleRuleDesc].push(styleOccurrence);

    return result;
};
