const specFileName = require('path').basename(__filename);
const Constants    = require('../../../src/Constants');
const SpecHelper   = require('../../SpecHelper');
const rule         = SpecHelper.getTreeRule(specFileName);

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects simplest wrong indentation case', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(result.line      ).toEqual('<br/>');
        expect(result.lineNumber).toEqual(2);
        expect(result.globalPos ).toEqual(6);
        expect(result.length    ).toEqual(3);
        expect(result.rule      ).toEqual(rule.id);
        expect(result.message   ).toEqual(rule.description);
    });

    it('detects wrong indentation with previous empty line', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1)[0];

        expect(result.line      ).toEqual('<br/>');
        expect(result.lineNumber).toEqual(3);
        expect(result.globalPos ).toEqual(7);
        expect(result.length    ).toEqual(3);
        expect(result.rule      ).toEqual(rule.id);
        expect(result.message   ).toEqual(rule.description);
    });

    it('ignores indentation for elements in the same line as their parents', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 2);

        expect(result).toEqual([]);
    });

    it('detects wrong indentation with previous sibling element', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 3)[0];

        expect(result.line      ).toEqual('<input type="text" />');
        expect(result.lineNumber).toEqual(3);
        expect(result.globalPos ).toEqual(87);
        expect(result.length    ).toEqual(5);
        expect(result.rule      ).toEqual(rule.id);
        expect(result.message   ).toEqual(rule.description);
    });

    it('checks indentation for elements at depth 0', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 5);

        expect(result).toEqual([]);
    });

    it('fixes the simplest possible template', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 0);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('fixes an element with no child', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 1);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('fixes a simple template for a comment tag with child in the same line', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 2);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('fixes a simple template for a comment tag with child in a different line', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 3);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('fixes "isif" tags', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 4);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('fixes a complex template', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 5);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('keeps a child element in the same line as the parent', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 6);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('sets Unix line breaks on autofix feature', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 0);

        expect(results.fixedTemplateContent.indexOf(Constants.lineBreak.windows)).toBe(-1);
    });

    it('maintains indentation for childless elements', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 7);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('keeps suffix indentation for a single-child node', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 8);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('keeps indentation for a multi-line value node\'s child', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 9);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('keeps indentation for a second child, childless node', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 10);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('does not add indentation to a same-line sibling', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 12);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });
});
