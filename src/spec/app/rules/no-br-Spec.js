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
        const fileContent      = SpecHelper.getRuleSpecTemplateContent(rule, 2);
        const result           = rule.check(fileContent);
        const firstOccurrrence = result.occurrences[0];

        expect(firstOccurrrence.line      ).toEqual('<div><br></div>');
        expect(firstOccurrrence.lineNumber).toEqual(1);
        expect(firstOccurrrence.globalPos ).toEqual(5);
        expect(firstOccurrrence.length    ).toEqual(4);
        expect(firstOccurrrence.rule      ).toEqual(rule.name);
        expect(firstOccurrrence.message   ).toEqual(rule.description);
    });

    it('detects <br /> (space, slash) tag within another tag', () => {
        const fileContent      = SpecHelper.getRuleSpecTemplateContent(rule, 3);
        const result           = rule.check(fileContent);
        const firstOccurrrence = result.occurrences[0];

        expect(firstOccurrrence.line      ).toEqual('<div><br /></div>');
        expect(firstOccurrrence.lineNumber).toEqual(2);
        expect(firstOccurrrence.globalPos ).toEqual(6);
        expect(firstOccurrrence.length    ).toEqual(6);
        expect(firstOccurrrence.rule      ).toEqual(rule.name);
        expect(firstOccurrrence.message   ).toEqual(rule.description);
    });

    it('detects <br/> (slash only) tag within another tag', () => {
        const fileContent      = SpecHelper.getRuleSpecTemplateContent(rule, 4);
        const result           = rule.check(fileContent);
        const firstOccurrrence = result.occurrences[0];

        expect(firstOccurrrence.line      ).toEqual('<div><br/></div>');
        expect(firstOccurrrence.lineNumber).toEqual(1);
        expect(firstOccurrrence.globalPos ).toEqual(5);
        expect(firstOccurrrence.length    ).toEqual(5);
        expect(firstOccurrrence.rule      ).toEqual(rule.name);
        expect(firstOccurrrence.message   ).toEqual(rule.description);
    });

    it('detects standalone <br> tag (no space nor slash)', () => {
        const fileContent      = SpecHelper.getRuleSpecTemplateContent(rule, 5);
        const result           = rule.check(fileContent);
        const firstOccurrrence = result.occurrences[0];

        expect(firstOccurrrence.line      ).toEqual('<br>');
        expect(firstOccurrrence.lineNumber).toEqual(1);
        expect(firstOccurrrence.globalPos ).toEqual(0);
        expect(firstOccurrrence.length    ).toEqual(4);
        expect(firstOccurrrence.rule      ).toEqual(rule.name);
        expect(firstOccurrrence.message   ).toEqual(rule.description);
    });

    it('detects standalone <br/> tag (slash)', () => {
        const fileContent      = SpecHelper.getRuleSpecTemplateContent(rule, 6);
        const result           = rule.check(fileContent);
        const firstOccurrrence = result.occurrences[0];

        expect(firstOccurrrence.line      ).toEqual('<br/>');
        expect(firstOccurrrence.lineNumber).toEqual(2);
        expect(firstOccurrrence.globalPos ).toEqual(1);
        expect(firstOccurrrence.length    ).toEqual(5);
        expect(firstOccurrrence.rule      ).toEqual(rule.name);
        expect(firstOccurrrence.message   ).toEqual(rule.description);
    });
});
