const SpecHelper   = require('../../../SpecHelper');
const specFileName = require('path').basename(__filename);

const rule = SpecHelper.getRule(specFileName);

describe('On Unix, ' + rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects inadequate code', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(templateContent);

        expect(result.occurrenceList).not.toEqual([]);
    });

    it('accepts code that is not related to the rule', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result          = rule.check(templateContent);

        expect(result.occurrenceList).toEqual([]);
    });

    it('detects "importPackage" usage', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(templateContent);
        const firstOccurrence = result.occurrenceList[0];

        expect(firstOccurrence.line        ).toEqual('importPackage( dw.system );');
        expect(firstOccurrence.lineNumber  ).toEqual(1);
        expect(firstOccurrence.columnNumber).toEqual(1);
        expect(firstOccurrence.globalPos   ).toEqual(0);
        expect(firstOccurrence.length      ).toEqual(13);
        expect(firstOccurrence.rule        ).toEqual(rule.id);
        expect(firstOccurrence.message     ).toEqual(rule.description);
    });
});
