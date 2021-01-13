const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../../SpecHelper');

const rule            = SpecHelper.getRule(specFileName);
const isCrlfLineBreak = true;

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects inadequate code in the middle of the line', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(templateContent, null, { isCrlfLineBreak });

        expect(result.occurrenceList).not.toEqual([]);
    });

    it('detects inadequate and indented code', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result          = rule.check(templateContent, null, { isCrlfLineBreak });

        expect(result.occurrenceList).not.toEqual([]);
    });

    it('detects unwrapped expressions inside HTML elements', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 5);
        const result          = rule.check(templateContent, null, { isCrlfLineBreak });

        expect(result.occurrenceList).not.toEqual([]);
    });

    it('accepts good code', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 2);
        const result          = rule.check(templateContent, null, { isCrlfLineBreak });

        expect(result.occurrenceList).toEqual([]);
    });

    it('accepts code that is not related to the rule', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 3);
        const result          = rule.check(templateContent, null, { isCrlfLineBreak });

        expect(result.occurrenceList).toEqual([]);
    });

    it('detects expression in the beginning of the line', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 4);
        const result          = rule.check(templateContent, null, { isCrlfLineBreak });
        const firstOccurrence = result.occurrenceList[0];

        expect(firstOccurrence.line      ).toEqual('${\'some ds code\'}');
        expect(firstOccurrence.lineNumber).toEqual(1);
        expect(firstOccurrence.globalPos ).toEqual(0);
        expect(firstOccurrence.length    ).toEqual(17);
        expect(firstOccurrence.rule      ).toEqual(rule.id);
        expect(firstOccurrence.message   ).toEqual(rule.description);
    });
});
