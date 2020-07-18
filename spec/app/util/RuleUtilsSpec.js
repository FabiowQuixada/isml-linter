const path       = require('path');
const SpecHelper = require('../../SpecHelper');
const RuleUtils  = require('../../../src/util/RuleUtils');
const Constants  = require('../../../src/Constants');

const ConfigUtils          = require('../../../src/util/ConfigUtils');
const NoIsscriptRule       = require('../../../src/rules/line_by_line/no-isscript');
const NoSpaceOnlyLinesRule = require('../../../src/rules/line_by_line/no-space-only-lines');
const NoInlineStyleRule    = require('../../../src/rules/line_by_line/no-inline-style');
const NoRequireInLoopRule  = require('../../../src/rules/tree/no-require-in-loop');
const NoHardcodeRule       = require('../../../src/rules/tree/no-hardcode');
const EnforceIsprintRule   = require('../../../src/rules/line_by_line/enforce-isprint');

const targetObjName = SpecHelper.getTargetObjName(__filename);

const templatePath   = path.join(Constants.templateParserSpecDir, 'template_0.isml');
const ptTemplatePath = path.join(Constants.templateParserSpecDir, 'pt_template_0.isml');

describe(targetObjName, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('holds the correct number of rules', () => {
        expect(RuleUtils.getAllLineRules().length).toBe(numberOfRules());
    });

    it('correctly parses a given ISML template', () => {
        const result = RuleUtils.checkTemplate(templatePath);

        expect(result).not.toEqual({});
    });

    it('ignores disabled rules', () => {

        ConfigUtils.load({
            rules: {
                'enforce-isprint': {},
                'no-inline-style': {}
            }
        });

        const result       = RuleUtils.checkTemplate(templatePath);
        const errorArray   = Object.keys(result.errors);
        let ruleWasChecked = false;

        for (let i = 0; i < errorArray.length; i++) {
            if (errorArray[i] === NoIsscriptRule.description) {
                ruleWasChecked = true;
            }
        }

        expect(ruleWasChecked).toBe(false);
    });

    it('checks non-disabled rules', () => {

        ConfigUtils.load({
            rules: {
                'enforce-isprint': {},
                'no-inline-style': {}
            }
        });

        const result       = RuleUtils.checkTemplate(templatePath);
        const ruleIdArray  = Object.keys(result.errors);
        let ruleWasChecked = false;

        for (let i = 0; i < ruleIdArray.length; i++) {
            const ruleId = ruleIdArray[i];
            if (ruleId === NoInlineStyleRule.id) {
                ruleWasChecked = true;
            }

        }

        expect(ruleWasChecked).toBe(true);
    });

    it('results in a json file', () => {
        ConfigUtils.load({
            rules: {
                'enforce-isprint': {},
                'no-inline-style': {}
            }
        });

        const actualResult     = RuleUtils.checkTemplate(templatePath);
        const isprintError0    = actualResult.errors[EnforceIsprintRule.id][0];
        const isprintError1    = actualResult.errors[EnforceIsprintRule.id][1];
        const inlineStyleError = actualResult.errors[NoInlineStyleRule.id][0];

        expect(actualResult.fixed).toBe(false);

        expect(isprintError0.line).toEqual('<isset name="pageUrl" value="${URLUtils.https(\'Reorder-ListingPage\')}" scope="page"/>');
        expect(isprintError0.lineNumber).toEqual(2);
        expect(isprintError0.globalPos).toEqual(30 + Constants.lineBreakOffset * (isprintError0.lineNumber - 1));
        expect(isprintError0.length).toEqual(40);
        expect(isprintError0.rule).toEqual(EnforceIsprintRule.id);
        expect(isprintError0.message).toEqual(EnforceIsprintRule.description);

        expect(isprintError1.line).toEqual('<div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>');
        expect(isprintError1.lineNumber).toEqual(3);
        expect(isprintError1.globalPos).toEqual(136 + Constants.lineBreakOffset * (isprintError1.lineNumber - 1));
        expect(isprintError1.length).toEqual(15);
        expect(isprintError1.rule).toEqual(EnforceIsprintRule.id);
        expect(isprintError1.message).toEqual(EnforceIsprintRule.description);

        expect(inlineStyleError.line).toEqual('<div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>');
        expect(inlineStyleError.lineNumber).toEqual(3);
        expect(inlineStyleError.globalPos).toEqual(113 + Constants.lineBreakOffset * (inlineStyleError.lineNumber - 1));
        expect(inlineStyleError.length).toEqual(5);
        expect(inlineStyleError.rule).toEqual(NoInlineStyleRule.id);
        expect(inlineStyleError.message).toEqual(NoInlineStyleRule.description);
    });

    it('ignores "pt_"-named templates for no-isscript (line) rule', () => {
        const actualResult = RuleUtils.checkTemplate(ptTemplatePath);

        expect(actualResult.errors[NoIsscriptRule.id]).toEqual(undefined);
        expect(actualResult.errors[NoSpaceOnlyLinesRule.id]).not.toEqual(undefined);
    });

    it('ignores "pt_"-named templates for no-require-in-loop (tree) rule', () => {
        const actualResult = RuleUtils.checkTemplate(ptTemplatePath);

        expect(actualResult.errors[NoRequireInLoopRule.id]).toEqual(undefined);
        expect(actualResult.errors[NoHardcodeRule.id]).not.toEqual(undefined);
    });
});

const numberOfRules = () => {
    let result = 0;

    const fileArray = require('fs').readdirSync(Constants.lineByLineRulesDir);

    for (let i = 0; i < fileArray.length; i++) {
        if (fileArray[i].endsWith('.js')) {
            result += 1;
        }
    }

    return result;
};
