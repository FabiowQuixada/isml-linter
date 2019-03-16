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

    it('ignores empty lines', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result      = rule.check(fileContent);

        expect(result.occurrences).toEqual([]);
    });

    it('accepts good code', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 2);
        const result      = rule.check(fileContent);

        expect(result.occurrences).toEqual([]);
    });

    it('detects position and length of space-only lines', () => {
        const fileContent    = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result         = rule.check(fileContent);
        const expectedResult = [{
            line: '     ',
            lineNumber: 1,
            columnStart: 0,
            length: 6
        }];

        expect(result.occurrences).toEqual(expectedResult);
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
