const specFileName = require('path').basename(__filename);
const Constants    = require('../../../../src/Constants');
const SpecHelper   = require('../../../SpecHelper');

const rule = SpecHelper.getTreeRule(specFileName);

describe('On Unix, ' + rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects a non-root <iscontent> element', () => {
        const occurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(occurrence.line      ).toEqual('<iscontent type="text/html" charset="UTF-8" compact="true" />');
        expect(occurrence.lineNumber).toEqual(2);
        expect(occurrence.globalPos ).toEqual(10);
        expect(occurrence.length    ).toEqual(61);
        expect(occurrence.rule      ).toEqual(rule.id);
        expect(occurrence.message   ).toEqual(rule.description);
    });

    it('does not raise an issue if <iscontent> is the first element in template', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1);

        expect(result).toEqual([]);
    });

    it('detects a root-level, but non-first <iscontent> element', () => {
        const occurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 2)[0];

        expect(occurrence.line      ).toEqual('<iscontent type="text/html" charset="UTF-8" compact="true" />');
        expect(occurrence.lineNumber).toEqual(3);
        expect(occurrence.globalPos ).toEqual(9);
        expect(occurrence.length    ).toEqual(61);
        expect(occurrence.rule      ).toEqual(rule.id);
        expect(occurrence.message   ).toEqual(rule.description);
    });

    it('does not raise an issue if <iscontent> is not present in the template', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 3);

        expect(result).toEqual([]);
    });

    it('fixes a simple template', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 0);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('fixes a complex template', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 1);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('does not modify the template if element is among the "k" first', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 2);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('keeps template original line break (CRLF)', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 0);

        expect(results.fixedTemplateContent.indexOf(Constants.lineBreak.windows)).toBe(61);
    });
});
