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

    it('does not apply to spaces-only lines', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result = rule.check(fileContent);

        expect(result.occurrences).toEqual([]);
    });

    it('does not apply to empty lines', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 2);
        const result = rule.check(fileContent);

        expect(result.occurrences).toEqual([]);
    });

    it('accepts good code', () => {
        const fileContent = SpecHelper.getRuleSpegetRuleSpecTemplateContentcTemplate(rule, 3);
        const result = rule.check(fileContent);

        expect(result.occurrences).toEqual([]);
    });

    it('detects trailing space chain position and length', () => {
        const fileContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result = rule.check(fileContent);
        const expectedResult = [{
            line: 'const sum = 0;    ',
            lineNumber: 0,
            columnStart: 14,
            length: 4
        }];

        expect(result.occurrences).toEqual(expectedResult);
    });
});
