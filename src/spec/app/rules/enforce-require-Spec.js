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
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result      = rule.check(fileContent);

        expect(result.occurrences).not.toEqual([]);
    });

    it('detects inadequate code in the middle of the line', () => {
        const fileContent    = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result         = rule.check(fileContent);
        const expectedResult = [{
            line        : '<a href="${dw.catalog.ProductSearchModel.urlForCategory(\'Search-Show\',cat.ID)}"',
            lineNumber  : 0,
            globalPos   : 11,
            length      : 29,
            rule        : rule.name,
            message     : rule.description
        }];

        expect(result.occurrences).not.toEqual(expectedResult);
    });

    it('accepts good code', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 2);
        const result      = rule.check(fileContent);

        expect(result.occurrences).toEqual([]);
    });

    it('accepts code that is not related to the rule', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 3);
        const result      = rule.check(fileContent);

        expect(result.occurrences).toEqual([]);
    });

    it('detects inadequate code upon declaration and no assignment', () => {
        const fileContent     = SpecHelper.getRuleSpecTemplateContent(rule, 4);
        const result          = rule.check(fileContent);
        const firstOccurrence = result.occurrences[0];

        expect(firstOccurrence.line      ).toEqual('const productLineItem : dw.order.ProductLineItem; // Some comment');
        expect(firstOccurrence.lineNumber).toEqual(2);
        expect(firstOccurrence.globalPos ).toEqual(25);
        expect(firstOccurrence.length    ).toEqual(24);
        expect(firstOccurrence.rule      ).toEqual(rule.name);
        expect(firstOccurrence.message   ).toEqual(rule.description);
    });
});
