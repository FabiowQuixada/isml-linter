const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../../SpecHelper');

const rule = SpecHelper.getRule(specFileName);

describe('On Unix, ' + rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects inadequate code', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(templateContent);

        expect(result.occurrences).not.toEqual([]);
    });

    it('accepts code that is not related to the rule', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result          = rule.check(templateContent);

        expect(result.occurrences).toEqual([]);
    });

    it('detects <br> (no space nor slash) tag within another tag', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 2);
        const result          = rule.check(templateContent);
        const firstOccurrence = result.occurrences[0];

        expect(firstOccurrence.line      ).toEqual('<div><br></div>');
        expect(firstOccurrence.lineNumber).toEqual(1);
        expect(firstOccurrence.globalPos ).toEqual(5);
        expect(firstOccurrence.length    ).toEqual(4);
        expect(firstOccurrence.rule      ).toEqual(rule.id);
        expect(firstOccurrence.message   ).toEqual(rule.description);
    });

    it('detects <br /> (space, slash) tag within another tag', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 3);
        const result          = rule.check(templateContent);
        const firstOccurrence = result.occurrences[0];

        expect(firstOccurrence.line      ).toEqual('<div><br /></div>');
        expect(firstOccurrence.lineNumber).toEqual(2);
        expect(firstOccurrence.globalPos ).toEqual(6);
        expect(firstOccurrence.length    ).toEqual(6);
        expect(firstOccurrence.rule      ).toEqual(rule.id);
        expect(firstOccurrence.message   ).toEqual(rule.description);
    });

    it('detects <br/> (slash only) tag within another tag', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 4);
        const result          = rule.check(templateContent);
        const firstOccurrence = result.occurrences[0];

        expect(firstOccurrence.line      ).toEqual('<div><br/></div>');
        expect(firstOccurrence.lineNumber).toEqual(1);
        expect(firstOccurrence.globalPos ).toEqual(5);
        expect(firstOccurrence.length    ).toEqual(5);
        expect(firstOccurrence.rule      ).toEqual(rule.id);
        expect(firstOccurrence.message   ).toEqual(rule.description);
    });

    it('detects standalone <br> tag (no space nor slash)', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 5);
        const result          = rule.check(templateContent);
        const firstOccurrence = result.occurrences[0];

        expect(firstOccurrence.line      ).toEqual('<br>');
        expect(firstOccurrence.lineNumber).toEqual(1);
        expect(firstOccurrence.globalPos ).toEqual(0);
        expect(firstOccurrence.length    ).toEqual(4);
        expect(firstOccurrence.rule      ).toEqual(rule.id);
        expect(firstOccurrence.message   ).toEqual(rule.description);
    });

    it('detects standalone <br/> tag (slash)', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 6);
        const result          = rule.check(templateContent);
        const firstOccurrence = result.occurrences[0];

        expect(firstOccurrence.line      ).toEqual('<br/>');
        expect(firstOccurrence.lineNumber).toEqual(2);
        expect(firstOccurrence.globalPos ).toEqual(1);
        expect(firstOccurrence.length    ).toEqual(5);
        expect(firstOccurrence.rule      ).toEqual(rule.id);
        expect(firstOccurrence.message   ).toEqual(rule.description);
    });
});
