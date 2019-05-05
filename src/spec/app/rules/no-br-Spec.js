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

    it('detects <br> (no space nor slash) tag within another tag', () => {
        const fileContent    = SpecHelper.getRuleSpecTemplateContent(rule, 2);
        const result         = rule.check(fileContent);
        const expectedResult = [{
            line        : '<div><br></div>',
            lineNumber  : 1,
            columnStart : 5,
            length      : 4,
            rule        : rule.name,
            message     : rule.description
        }];

        expect(result.occurrences).toEqual(expectedResult);
    });

    it('detects <br /> (space, slash) tag within another tag', () => {
        const fileContent    = SpecHelper.getRuleSpecTemplateContent(rule, 3);
        const result         = rule.check(fileContent);
        const expectedResult = [{
            line        : '<div><br /></div>',
            lineNumber  : 2,
            columnStart : 6,
            length      : 6,
            rule        : rule.name,
            message     : rule.description
        }];

        expect(result.occurrences).toEqual(expectedResult);
    });

    it('detects <br/> (slash only) tag within another tag', () => {
        const fileContent    = SpecHelper.getRuleSpecTemplateContent(rule, 4);
        const result         = rule.check(fileContent);
        const expectedResult = [{
            line        : '<div><br/></div>',
            lineNumber  : 1,
            columnStart : 5,
            length      : 5,
            rule        : rule.name,
            message     : rule.description
        }];

        expect(result.occurrences).toEqual(expectedResult);
    });

    it('detects standalone <br> tag (no space nor slash)', () => {
        const fileContent    = SpecHelper.getRuleSpecTemplateContent(rule, 5);
        const result         = rule.check(fileContent);
        const expectedResult = [{
            line        : '<br>',
            lineNumber  : 1,
            columnStart : 0,
            length      : 4,
            rule        : rule.name,
            message     : rule.description
        }];

        expect(result.occurrences).toEqual(expectedResult);
    });

    it('detects standalone <br/> tag (slash)', () => {
        const fileContent    = SpecHelper.getRuleSpecTemplateContent(rule, 6);
        const result         = rule.check(fileContent);
        const expectedResult = [{
            line        : '<br/>',
            lineNumber  : 2,
            columnStart : 1,
            length      : 5,
            rule        : rule.name,
            message     : rule.description
        }];

        expect(result.occurrences).toEqual(expectedResult);
    });
});
