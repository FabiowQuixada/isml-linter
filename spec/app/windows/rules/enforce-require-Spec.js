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

    it('detects inadequate code', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(templateContent, { isCrlfLineBreak });

        expect(result.occurrenceList).not.toEqual([]);
    });

    it('detects inadequate code in the middle of the line', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result          = rule.check(templateContent, { isCrlfLineBreak });
        const expectedResult  = [{
            line         : '<a href="${dw.catalog.ProductSearchModel.urlForCategory(\'Search-Show\',cat.ID)}"',
            lineNumber   : 0,
            columnNumber : 12,
            globalPos    : 11,
            length       : 29,
            rule         : rule.id,
            message      : rule.description
        }];

        expect(result.occurrenceList).not.toEqual(expectedResult);
    });

    it('accepts good code', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 2);
        const result          = rule.check(templateContent, { isCrlfLineBreak });

        expect(result.occurrenceList).toEqual([]);
    });

    it('accepts code that is not related to the rule', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 3);
        const result          = rule.check(templateContent, { isCrlfLineBreak });

        expect(result.occurrenceList).toEqual([]);
    });

    it('detects inadequate code upon declaration and no assignment', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 4);
        const result          = rule.check(templateContent, { isCrlfLineBreak });
        const firstOccurrence = result.occurrenceList[0];

        expect(firstOccurrence.line        ).toEqual('const productLineItem : dw.order.ProductLineItem; // Some comment');
        expect(firstOccurrence.lineNumber  ).toEqual(2);
        expect(firstOccurrence.columnNumber).toEqual(25);
        expect(firstOccurrence.globalPos   ).toEqual(26);
        expect(firstOccurrence.length      ).toEqual(24);
        expect(firstOccurrence.rule        ).toEqual(rule.id);
        expect(firstOccurrence.message     ).toEqual(rule.description);
    });
});
