const specFileName = require('path').basename(__filename);
const Constants    = require('../../../../src/Constants');
const SpecHelper   = require('../../../SpecHelper');
const ConfigUtils  = require('../../../../src/util/ConfigUtils');

const rule            = SpecHelper.getTreeRule(specFileName);
const isCrlfLineBreak = true;

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects simplest wrong indentation case', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0, isCrlfLineBreak)[0];

        expect(result.line        ).toEqual('<br/>');
        expect(result.lineNumber  ).toEqual(2);
        expect(result.columnNumber).toEqual(4);
        expect(result.globalPos   ).toEqual(7);
        expect(result.length      ).toEqual(3);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual('Expected indentation of 4 spaces but found 3');
    });

    it('detects wrong indentation with previous empty line', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1, isCrlfLineBreak)[0];

        expect(result.line        ).toEqual('<br/>');
        expect(result.lineNumber  ).toEqual(3);
        expect(result.columnNumber).toEqual(4);
        expect(result.globalPos   ).toEqual(9);
        expect(result.length      ).toEqual(3);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual('Expected indentation of 4 spaces but found 3');
    });

    it('ignores indentation for elements in the same line as their parents', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 2, isCrlfLineBreak);

        expect(result).toEqual([]);
    });

    it('detects wrong indentation with previous sibling element', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 3, isCrlfLineBreak)[0];

        expect(result.line        ).toEqual('<input type="text" />');
        expect(result.lineNumber  ).toEqual(3);
        expect(result.columnNumber).toEqual(6);
        expect(result.globalPos   ).toEqual(89);
        expect(result.length      ).toEqual(5);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual('Expected indentation of 4 spaces but found 5');
    });

    it('checks indentation for elements at depth 0', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 5, isCrlfLineBreak);

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

    it('keeps indentation for a after-non-tag-same-line element', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 11);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('does not add indentation to a same-line sibling', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 12);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('keeps indentation for a after-tag-same-line element', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 13);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('keeps indentation for an element in the same line as parent\'s value end', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 14);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('keeps indentation for single child element', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 15);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('does not affect elements in the same line', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 16);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('does not apply to <script> tag content', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 6, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('does not take container nodes into account', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 7, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('applies for elements that have a hardcode as first sibling', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 8, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('checks if indentation is set as previous node trailing spaces I', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 9, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('checks if indentation is set as previous node trailing spaces II', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 10, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('checks if indentation is set as previous node trailing spaces III', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 11, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('checks if indentation is set as previous node trailing spaces IV', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 12, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('ignores <iscomment> content', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 13, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('raises only one issue if only a node opening tag is miss-indented', () => {
        const result     = SpecHelper.parseAndApplyRuleToTemplate(rule, 14, isCrlfLineBreak);
        const occurrence = result[0];

        expect(result.length        ).toEqual(1);
        expect(occurrence.lineNumber).toEqual(2);
        expect(occurrence.message   ).toEqual('Expected indentation of 4 spaces but found 5');
    });

    it('raises an issue if only a node closing tag is miss-indented', () => {
        const result     = SpecHelper.parseAndApplyRuleToTemplate(rule, 15, isCrlfLineBreak);
        const occurrence = result[0];

        expect(result.length        ).toEqual(1);
        expect(occurrence.lineNumber).toEqual(4);
        expect(occurrence.message   ).toEqual('Expected indentation of 4 spaces but found 6');
    });

    it('checks if indentation is set as previous node trailing spaces V', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 16, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('checks if indentation is set as previous node trailing spaces VI', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 17, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('checks indentation for first element at line 1', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 18, isCrlfLineBreak)[0];

        expect(result.globalPos).toEqual(0);
        expect(result.length).toEqual(8);
    });

    it('checks indentation for first "isif" element at line 1', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 19, isCrlfLineBreak)[0];

        expect(result.globalPos).toEqual(0);
        expect(result.length).toEqual(4);
    });

    it('identifies occurrence global position and length III', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 20, isCrlfLineBreak)[0];

        expect(result.globalPos).toEqual(39);
        expect(result.length).toEqual(4);
    });

    it('ignores indentation if element is in the same line as previous sibling', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 21, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('identifies wrong indentation on node suffix value', () => {
        const result                = SpecHelper.parseAndApplyRuleToTemplate(rule, 18, isCrlfLineBreak);
        const valueOccurrence       = result[0];
        const suffixValueOccurrence = result[1];

        expect(valueOccurrence.globalPos      ).toEqual(0);
        expect(valueOccurrence.length         ).toEqual(8);
        expect(suffixValueOccurrence.globalPos).toEqual(18);
        expect(suffixValueOccurrence.length   ).toEqual(10);
    });

    it('checks indentation for an "isif" tag after an expression', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 22, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('checks indentation for nested "isif" tags', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 23, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('check indentation of closing tag after a hardcoded text', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 24, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('detects indentation of closing </isscript> tag', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 25);

        expect(result.length).toEqual(0);
    });

    it('detects indentation of closing </iscomment> tag', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 26);

        expect(result.length).toEqual(0);
    });

    it('sets indent value to different than default', () => {
        ConfigUtils.load({
            rules: {
                'indent': {
                    value : 2
                }
            }
        });

        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 27);

        expect(result.length).toEqual(0);
    });

    it('reports occurrence column number', () => {
        const occurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 15)[0];

        expect(occurrence.columnNumber).toEqual(7);
    });

    it('reports occurrence column number II', () => {
        const result      = SpecHelper.parseAndApplyRuleToTemplate(rule, 18);
        const occurrence1 = result[0];
        const occurrence2 = result[1];

        expect(occurrence1.columnNumber).toEqual(9);
        expect(occurrence2.columnNumber).toEqual(11);
    });

    it('reports occurrence column number III', () => {
        const result      = SpecHelper.parseAndApplyRuleToTemplate(rule, 20);
        const occurrence1 = result[0];
        const occurrence2 = result[1];

        expect(occurrence1.columnNumber).toEqual(5);
        expect(occurrence2.columnNumber).toEqual(2);
    });

    it('reports occurrence column number IV', () => {
        const result      = SpecHelper.parseAndApplyRuleToTemplate(rule, 28);
        const occurrence1 = result[0];

        expect(occurrence1.columnNumber).toEqual(1);
    });

    it('does not replicate indentation due to last child trailing spaces', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 29);

        expect(result.length).toEqual(0);
    });

    it('keeps suffix indentation for node with a last child with trailing spaces', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 17);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('keeps suffix indentation for node with a previous sibling with trailing spaces', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 18);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('autofix does not affect "iscomment" tags content', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 19);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('autofix does not affect "script" tags content', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 20);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('autofix does not affect "isscript" tags content', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 21);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('autofix does not affect "iscomment" tags content II', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 22);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('autofix adds indentation to unwrapped expressions', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 23);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('autofix keeps spaces for elements in the same line', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 24);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('autofix keeps spaces for elements in the same line II', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 25);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });
});
