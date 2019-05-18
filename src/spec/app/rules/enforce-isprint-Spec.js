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

    it('detects unwraped expressions inside HTML elements', () => {
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
        const fileContent    = SpecHelper.getRuleSpecTemplateContent(rule, 4);
        const result         = rule.check(fileContent);
        const expectedResult = [{
            line        : '${\'some ds code\'}',
            lineNumber  : 1,
            globalPos : 0,
            length      : 17,
            rule        : rule.name,
            message     : rule.description
        }];

        expect(result.occurrences).toEqual(expectedResult);
    });
});
