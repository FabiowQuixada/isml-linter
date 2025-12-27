const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../../SpecHelper');
const ConfigUtils  = require('../../../../src/util/ConfigUtils');
const Constants    = require('../../../../src/Constants');

const rule = SpecHelper.getTreeRule(specFileName);

describe('On Unix, ' + rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
        ConfigUtils.setRuleConfig('one-element-per-line', {});
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects elements in the same line', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(result.line      ).toEqual('${Resource.msg(\'field.billing.address.last.name\',\'address\',null)}');
        expect(result.lineNumber).toEqual(7);
        expect(result.globalPos ).toEqual(360);
        expect(result.length    ).toEqual(65);
        expect(result.rule      ).toEqual(rule.id);
        expect(result.message   ).toEqual(rule.description);
    });

    it('allows one element per line', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1);

        expect(result).toEqual([]);
    });

    it('ignores container nodes', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 2);

        expect(result.length).toEqual(0);
    });

    it('fixes a simple template', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 0);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('ignores ISML comment nodes', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 1);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('fixes a complex template', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 2);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('fixes a complex template with custom indent size', () => {
        ConfigUtils.load({
            rules  : {
                'one-element-per-line' : {},
                indent: {
                    value : 2
                }
            }
        });
        const results = SpecHelper.getTreeRuleFixData(rule, 3);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('puts an element in its own line if it\'s in the same line as its previous sibling', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 4);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('doesn\'t add an extra line break to element tail', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 5);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('allows non-tag elements to be in the same line as parent if configuration is set', () => {
        ConfigUtils.setRuleConfig('one-element-per-line', {
            except: ['non-tag']
        });
        const results = SpecHelper.getTreeRuleFixData(rule, 6);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('allows non-tag elements to be in the same line as parent if configuration is set II', () => {
        ConfigUtils.setRuleConfig('one-element-per-line', {
            except: ['non-tag']
        });
        const results = SpecHelper.getTreeRuleFixData(rule, 7);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('allows non-tag elements to be in the same line as parent if configuration is set III', () => {
        ConfigUtils.setRuleConfig('one-element-per-line', {
            except: ['non-tag']
        });
        const results = SpecHelper.getTreeRuleFixData(rule, 8);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('sets element to its own line if it is in the same line as parent head end line', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 9);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('allows non-tag elements to be in the same line by default', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 10);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('allows non-tag elements to be in the same line by default II', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 11);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('keeps template original line break (CRLF)', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 0);

        expect(results.actualContent.indexOf(Constants.lineBreak.windows)).toBe(4);
    });

    it('does not raise an issue for special characters by default', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 6);

        expect(result.length).toEqual(0);
    });

    it('does not raise an issue for special characters by default II', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 7);

        expect(result.length).toEqual(0);
    });

    it('ignores "textarea" element content', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 12);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('ignores "script" element content', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 13);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('ignores "style" element content', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 14);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('uses config Unix line endings', () => {
        ConfigUtils.load({
            linebreakStyle : 'unix',
            rules : {
                'one-element-per-line' : {}
            }
        });

        const results = SpecHelper.getTreeRuleFixData(rule, 0);

        expect(results.actualContent.indexOf(Constants.lineBreak.unix)).not.toBe(-1);
        expect(results.actualContent.indexOf(Constants.lineBreak.windows)).toBe(-1);
    });
});
