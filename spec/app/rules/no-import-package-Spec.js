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

    it('accepts code that is not related to the rule', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result      = rule.check(fileContent);

        expect(result.occurrences).toEqual([]);
    });

    it('detects "importPackage" usage', () => {
        const fileContent     = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(fileContent);
        const firstOccurrence = result.occurrences[0];

        expect(firstOccurrence.line      ).toEqual('importPackage( dw.system );');
        expect(firstOccurrence.lineNumber).toEqual(1);
        expect(firstOccurrence.globalPos ).toEqual(0 + SpecHelper.getEolOffset(firstOccurrence.lineNumber));
        expect(firstOccurrence.length    ).toEqual(13);
        expect(firstOccurrence.rule      ).toEqual(rule.name);
        expect(firstOccurrence.message   ).toEqual(rule.description);
    });
});
