const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../SpecHelper');
// const ConfigUtils  = require('../../../src/util/ConfigUtils');
// const Constants = require('../../../src/Constants');

const rule         = SpecHelper.getTreeRule(specFileName);

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects elements in the same line', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(result.line      ).toEqual('${Resource.msg(\'field.billing.address.last.name\',\'address\',null)}');
        expect(result.lineNumber).toEqual(7);
        expect(result.globalPos ).toEqual(360);
        expect(result.length    ).toEqual(65);
        expect(result.rule      ).toEqual(rule.id);
        expect(result.message   ).toEqual(rule.description);
    });

    it('allows one element per line', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1);

        expect(result).toEqual([]);
    });

    // it('fixes a simple template', () => {
    //     const results = SpecHelper.getTreeRuleFixData(rule, 0);

    //     expect(results.actualContent).toEqual(results.fixedTemplateContent);
    // });

    // it('ignores ISML comment nodes', () => {
    //     const results = SpecHelper.getTreeRuleFixData(rule, 1);

    //     expect(results.actualContent).toEqual(results.fixedTemplateContent);
    // });

    // it('fixes a complex template', () => {
    //     const results = SpecHelper.getTreeRuleFixData(rule, 2);

    //     expect(results.actualContent).toEqual(results.fixedTemplateContent);
    // });

    // it('fixes a complex template with custom indent size', () => {
    //     ConfigUtils.load({
    //         indent : 2,
    //         rules  : {
    //             'one-element-per-line' : {}
    //         }
    //     });
    //     const results = SpecHelper.getTreeRuleFixData(rule, 3);

    //     expect(results.actualContent).toEqual(results.fixedTemplateContent);
    // });

    // it('sets Unix line breaks on autofix feature', () => {
    //     const results = SpecHelper.getTreeRuleFixData(rule, 0);

    // expect(results.fixedTemplateContent.indexOf(Constants.lineBreak.windows)).toBe(-1);
    // });
});
