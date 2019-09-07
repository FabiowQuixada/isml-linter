const SpecHelper   = require('../../SpecHelper');
const specFileName = require('path').basename(__filename);
const rule         = SpecHelper.getRule(specFileName);
const Constants    = require('../../../src/app/Constants');

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects inadequate code', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(templateContent);

        expect(result.occurrences).not.toEqual([]);
    });

    it('ignores empty lines', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result          = rule.check(templateContent);

        expect(result.occurrences).toEqual([]);
    });

    it('accepts good code', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 2);
        const result          = rule.check(templateContent);

        expect(result.occurrences).toEqual([]);
    });

    it('detects position and length of space-only lines', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(templateContent);
        const firstOccurrence = result.occurrences[0];

        expect(firstOccurrence.line      ).toEqual('     ');
        expect(firstOccurrence.lineNumber).toEqual(1);
        expect(firstOccurrence.globalPos ).toEqual(0);
        expect(firstOccurrence.length    ).toEqual(6);
        expect(firstOccurrence.rule      ).toEqual(rule.id);
        expect(firstOccurrence.message   ).toEqual(rule.description);
    });

    it('fixes a simple template', () => {
        const results = SpecHelper.getLineRuleFixData(rule, 0);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('fixes a complex template', () => {
        const results = SpecHelper.getLineRuleFixData(rule, 1);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('sets Unix line breaks on autofix feature', () => {
        const results = SpecHelper.getLineRuleFixData(rule, 0);

        expect(results.fixedTemplateContent.indexOf(Constants.lineBreak.windows)).toBe(-1);
    });
});
