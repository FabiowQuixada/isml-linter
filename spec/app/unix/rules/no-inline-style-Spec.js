const SpecHelper   = require('../../../SpecHelper');
const ConfigUtils  = require('../../../../src/util/ConfigUtils');
const specFileName = require('path').basename(__filename);

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

        expect(result.occurrenceList).not.toEqual([]);
    });

    it('ignores empty lines', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result          = rule.check(templateContent);

        expect(result.occurrenceList).toEqual([]);
    });

    it('detects simple style occurrence', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(templateContent);
        const firstOccurrence = result.occurrenceList[0];

        expect(firstOccurrence.line        ).toEqual('<div style="display: none;">');
        expect(firstOccurrence.lineNumber  ).toEqual(1);
        expect(firstOccurrence.columnNumber).toEqual(6);
        expect(firstOccurrence.globalPos   ).toEqual(5);
        expect(firstOccurrence.length      ).toEqual(5);
        expect(firstOccurrence.rule        ).toEqual(rule.id);
        expect(firstOccurrence.message     ).toEqual(rule.description);
    });

    it('allows "style" attribute in "isprint" tag', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 2);
        const result          = rule.check(templateContent);

        expect(result.occurrenceList).toEqual([]);
    });

    it('allows attribute with "style" substring', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 3);
        const result          = rule.check(templateContent);

        expect(result.occurrenceList).toEqual([]);
    });

    it('allows dynamic expressions by default', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 4);
        const result          = rule.check(templateContent);

        expect(result.occurrenceList.length).toEqual(0);
    });

    it('disallows dynamic expressions if set explicitly in configuration file', () => {
        ConfigUtils.load({
            rules: {
                'no-inline-style': {
                    allowWhenDynamic: false
                }
            }
        });
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 4);
        const result          = rule.check(templateContent);

        expect(result.occurrenceList.length).toEqual(1);
    });

    it('disallows style attribute even if there is an ISML expression in the same line, but outside of its value', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 5);
        const result          = rule.check(templateContent);

        expect(result.occurrenceList.length).toEqual(1);
    });
});
