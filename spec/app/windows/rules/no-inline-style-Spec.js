const SpecHelper   = require('../../../SpecHelper');
const specFileName = require('path').basename(__filename);

const rule            = SpecHelper.getRule(specFileName);
const isCrlfLineBreak = true;

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects inadequate code', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(templateContent, { isCrlfLineBreak });

        expect(result.occurrenceList).not.toEqual([]);
    });

    it('ignores empty lines', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result          = rule.check(templateContent, { isCrlfLineBreak });

        expect(result.occurrenceList).toEqual([]);
    });

    it('detects simple style occurrence', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(templateContent, { isCrlfLineBreak });
        const firstOccurrence = result.occurrenceList[0];

        expect(firstOccurrence.line        ).toEqual('<div style="display: none;">');
        expect(firstOccurrence.lineNumber  ).toEqual(1);
        expect(firstOccurrence.columnNumber).toEqual(6);
        expect(firstOccurrence.globalPos   ).toEqual(5);
        expect(firstOccurrence.length      ).toEqual(5);
        expect(firstOccurrence.rule        ).toEqual(rule.id);
        expect(firstOccurrence.message     ).toEqual(rule.description);
    });
});
