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

    it('detects unresolved conflict', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result      = rule.check(fileContent);

        expect(result.occurrences).not.toEqual([]);
    });

    it('accepts code that is not related to the rule', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result      = rule.check(fileContent);

        expect(result.occurrences).toEqual([]);
    });

    it('detects position and length of space-only lines', () => {
        const fileContent    = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result         = rule.check(fileContent);
        const expectedResult = [{
            line        : '<<<<<<< HEAD',
            lineNumber  : 1,
            globalPos : 0,
            length      : 12,
            rule        : rule.name,
            message     : rule.description
        },
        {
            line        : '=======',
            lineNumber  : 3,
            globalPos : 25,
            length      : 7,
            rule        : rule.name,
            message     : rule.description
        }];

        expect(result.occurrences).toEqual(expectedResult);
    });
});
