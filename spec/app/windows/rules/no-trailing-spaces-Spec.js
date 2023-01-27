const SpecHelper   = require('../../../SpecHelper');
const Constants    = require('../../../../src/Constants');
const ConfigUtils  = require('../../../../src/util/ConfigUtils');
const specFileName = require('path').basename(__filename);

const rule            = SpecHelper.getRule(specFileName);
const isCrlfLineBreak = true;

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects inadequate code', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(templateContent, { isCrlfLineBreak });

        expect(result.occurrenceList).not.toEqual([]);
    });

    it('does not apply to spaces-only lines', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result          = rule.check(templateContent, { isCrlfLineBreak });

        expect(result.occurrenceList).toEqual([]);
    });

    it('does not apply to empty lines', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 2);
        const result          = rule.check(templateContent, { isCrlfLineBreak });

        expect(result.occurrenceList).toEqual([]);
    });

    it('accepts good code', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 3);
        const result          = rule.check(templateContent, { isCrlfLineBreak });

        expect(result.occurrenceList).toEqual([]);
    });

    it('detects trailing space chain position and length', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(templateContent, { isCrlfLineBreak });
        const firstOccurrence = result.occurrenceList[0];

        expect(firstOccurrence.line        ).toEqual('const sum = 0;    ');
        expect(firstOccurrence.lineNumber  ).toEqual(1);
        expect(firstOccurrence.columnNumber).toEqual(15);
        expect(firstOccurrence.globalPos   ).toEqual(14);
        expect(firstOccurrence.length      ).toEqual(4);
        expect(firstOccurrence.rule        ).toEqual(rule.id);
        expect(firstOccurrence.message     ).toEqual(rule.description);
    });

    it('fixes a simple template', () => {
        const results = SpecHelper.getLineRuleFixData(rule, 0);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('fixes a complex template', () => {
        const results = SpecHelper.getLineRuleFixData(rule, 1);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('keeps template original line break (CRLF)', () => {
        const results = SpecHelper.getLineRuleFixData(rule, 0);

        expect(results.fixedTemplateContent.indexOf(Constants.lineBreak.windows)).toBe(23);
    });

    it('identifies issue global position', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 4);
        const result          = rule.check(templateContent, { isCrlfLineBreak });
        const occurrence      = result.occurrenceList[0];

        expect(occurrence.globalPos).toEqual(63);
    });

    it('identifies issue global position II', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 5);
        const result          = rule.check(templateContent, { isCrlfLineBreak });
        const occurrence      = result.occurrenceList[0];
        const occurrence2     = result.occurrenceList[1];

        expect(occurrence.globalPos ).toEqual(56);
        expect(occurrence2.globalPos).toEqual(108);
    });

    it('uses config Unix line endings', () => {
        ConfigUtils.load({
            linebreakStyle : 'unix',
            rules : {
                'no-trailing-spaces' : {}
            }
        });

        const results = SpecHelper.getLineRuleFixData(rule, 0);

        expect(results.actualContent.indexOf(Constants.lineBreak.unix)).not.toBe(-1);
        expect(results.actualContent.indexOf(Constants.lineBreak.windows)).toBe(-1);
    });
});
