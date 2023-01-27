const specFileName = require('path').basename(__filename);
const Constants    = require('../../../../src/Constants');
const SpecHelper   = require('../../../SpecHelper');

const rule            = SpecHelper.getTreeRule(specFileName);
const isCrlfLineBreak = true;

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('allows non-slashy <iselse> elements', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('detects slashy <iselse> elements', () => {
        const result      = SpecHelper.parseAndApplyRuleToTemplate(rule, 1, isCrlfLineBreak);
        const occurrence0 = result[0];
        const occurrence1 = result[1];

        expect(occurrence0.line       ).toEqual('<iselseif condition="${anotherCondition}"/>');
        expect(occurrence0.lineNumber ).toEqual(3);
        expect(occurrence0.globalPos  ).toEqual(48);
        expect(occurrence0.length     ).toEqual(43);
        expect(occurrence0.rule       ).toEqual(rule.id);
        expect(occurrence0.message    ).toEqual(rule.description);

        expect(occurrence1.line       ).toEqual('<iselse/>');
        expect(occurrence1.lineNumber ).toEqual(5);
        expect(occurrence1.globalPos  ).toEqual(107);
        expect(occurrence1.length     ).toEqual(9);
        expect(occurrence1.rule       ).toEqual(rule.id);
        expect(occurrence1.message    ).toEqual(rule.description);
    });

    it('fixes iselse slashy tag', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 0);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('fixes iselseif slashy tag', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 1);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('does not change correct tags', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 2);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('fixes a complex template', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 3);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('keeps template original line break (CRLF)', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 0);

        expect(results.fixedTemplateContent.indexOf(Constants.lineBreak.windows)).toBe(32);
    });
});
