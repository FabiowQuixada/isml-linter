const SpecHelper = require('../../SpecHelper');
const specFileName = require('path').basename(__filename);
const rule = SpecHelper.getRule(specFileName);

describe(rule.name, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects inadequate code', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result = rule.check(fileContent);

        expect(result.occurrences).not.toEqual([]);
    });

    it('accepts code that is not related to the rule', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result = rule.check(fileContent);

        expect(result.occurrences).toEqual([]);
    });

    it('detects tab character position', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result = rule.check(fileContent);
        const expectedResult = [{
            line        : '	',
            lineNumber  : 1,
            globalPos : 0,
            length      : 1,
            rule        : rule.name,
            message     : rule.description
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
