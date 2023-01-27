const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../../SpecHelper');
const Constants    = require('../../../../src/Constants');
const ConfigUtils  = require('../../../../src/util/ConfigUtils');

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

    it('accepts code that is not related to the rule', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result          = rule.check(templateContent);

        expect(result.occurrenceList).toEqual([]);
    });

    it('detects tab character position', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(templateContent);
        const firstOccurrence = result.occurrenceList[0];

        // eslint-disable-next-line no-tabs
        expect(firstOccurrence.line        ).toEqual('	');
        expect(firstOccurrence.lineNumber  ).toEqual(1);
        expect(firstOccurrence.columnNumber).toEqual(1);
        expect(firstOccurrence.globalPos   ).toEqual(0);
        expect(firstOccurrence.length      ).toEqual(1);
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

    it('uses config Unix line endings', () => {
        ConfigUtils.load({
            linebreakStyle : 'unix',
            rules : {
                'no-tabs' : {}
            }
        });

        const results = SpecHelper.getLineRuleFixData(rule, 0);

        expect(results.actualContent.indexOf(Constants.lineBreak.unix)).not.toBe(-1);
        expect(results.actualContent.indexOf(Constants.lineBreak.windows)).toBe(-1);
    });
});
