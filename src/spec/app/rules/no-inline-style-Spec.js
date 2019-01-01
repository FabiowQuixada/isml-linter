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

    it('detects simple style occurrence', () => {
        const fileContent    = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result         = rule.check(fileContent);
        const expectedResult = [{
            line: '<div style="display: none;">',
            lineNumber: 1,
            columnStart: 5,
            length: 5
        }];

        expect(result.occurrences).toEqual(expectedResult);
    });
});
