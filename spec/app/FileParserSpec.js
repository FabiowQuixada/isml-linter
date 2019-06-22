const path                 = require('path');
const SpecHelper           = require('../SpecHelper');
const FileParser           = require('../../src/app/FileParser');
const ConfigUtils          = require('../../src/app/util/ConfigUtils');
const Constants            = require('../../src/app/Constants');
const NoIsscriptRule       = require('../../src/app/rules/line_by_line/no-isscript');
const NoSpaceOnlyLinesRule = require('../../src/app/rules/line_by_line/no-space-only-lines');
const NoInlineStyleRule    = require('../../src/app/rules/line_by_line/no-inline-style');
const NoRequireInLoopRule  = require('../../src/app/rules/tree/no-require-in-loop');
const NoHardcodeRule       = require('../../src/app/rules/tree/no-hardcode');
const EnforceIsprintRule   = require('../../src/app/rules/line_by_line/enforce-isprint');

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

        const actualResult     = FileParser.parse(filePath);
        const isprintError0    = actualResult.errors[EnforceIsprintRule.description][0];
        const isprintError1    = actualResult.errors[EnforceIsprintRule.description][1];
        const inlineStyleError = actualResult.errors[NoInlineStyleRule.description][0];

        expect(actualResult.fixed).toBe(false);

        expect(isprintError0.line).toEqual('<isset name="pageUrl" value="${URLUtils.https(\'Reorder-ListingPage\')}" scope="page"/>');
        expect(isprintError0.lineNumber).toEqual(2);
        expect(isprintError0.globalPos).toEqual(30);
        expect(isprintError0.length).toEqual(40);
        expect(isprintError0.rule).toEqual(EnforceIsprintRule.name);
        expect(isprintError0.message).toEqual(EnforceIsprintRule.description);

        expect(isprintError1.line).toEqual('<div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>');
        expect(isprintError1.lineNumber).toEqual(3);
        expect(isprintError1.globalPos).toEqual(136);
        expect(isprintError1.length).toEqual(15);
        expect(isprintError1.rule).toEqual(EnforceIsprintRule.name);
        expect(isprintError1.message).toEqual(EnforceIsprintRule.description);

        expect(inlineStyleError.line).toEqual('<div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>');
        expect(inlineStyleError.lineNumber).toEqual(3);
        expect(inlineStyleError.globalPos).toEqual(113);
        expect(inlineStyleError.length).toEqual(5);
        expect(inlineStyleError.rule).toEqual(NoInlineStyleRule.name);
        expect(inlineStyleError.message).toEqual(NoInlineStyleRule.description);
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
