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

    it('detects inadequate code in the middle of the line', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result      = rule.check(fileContent);

        expect(result.occurrences).not.toEqual([]);
    });

    it('detects inadequate and indented code', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result      = rule.check(fileContent);

        expect(result.occurrences).not.toEqual([]);
    });

    it('detects unwrapped expressions inside HTML elements', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 5);
        const result      = rule.check(fileContent);

        expect(result.occurrences).not.toEqual([]);
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

    it('detects expression in the beginning of the line', () => {
        const fileContent     = SpecHelper.getRuleSpecTemplateContent(rule, 4);
        const result          = rule.check(fileContent);
        const firstOccurrence = result.occurrences[0];

        expect(firstOccurrence.line      ).toEqual('${\'some ds code\'}');
        expect(firstOccurrence.lineNumber).toEqual(1);
        expect(firstOccurrence.globalPos ).toEqual(0);
        expect(firstOccurrence.length    ).toEqual(17);
        expect(firstOccurrence.rule      ).toEqual(rule.name);
        expect(firstOccurrence.message   ).toEqual(rule.description);
    });
});
