const SpecHelper   = require('../../SpecHelper');
const specFileName = require('path').basename(__filename);
const rule         = SpecHelper.getRule(specFileName);

describe(rule.name, () => {
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

    it('does not apply to spaces-only lines', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result          = rule.check(templateContent);

        expect(result.occurrences).toEqual([]);
    });

    it('does not apply to empty lines', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 2);
        const result          = rule.check(templateContent);

        expect(result.occurrences).toEqual([]);
    });

    it('accepts good code', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 3);
        const result          = rule.check(templateContent);

        expect(result.occurrences).toEqual([]);
    });

    it('detects trailing space chain position and length', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(templateContent);
        const firstOccurrence = result.occurrences[0];

        expect(firstOccurrence.line      ).toEqual('const sum = 0;    ');
        expect(firstOccurrence.lineNumber).toEqual(1);
        expect(firstOccurrence.globalPos ).toEqual(14 + SpecHelper.getEolOffset(firstOccurrence.lineNumber));
        expect(firstOccurrence.length    ).toEqual(4);
        expect(firstOccurrence.rule      ).toEqual(rule.name);
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
});
