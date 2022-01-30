const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../../SpecHelper');
const ConfigUtils  = require('../../../../src/util/ConfigUtils');
const Constants    = require('../../../../src/Constants');

const rule            = SpecHelper.getTreeRule(specFileName);
const isCrlfLineBreak = true;

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects elements in the same line', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0, isCrlfLineBreak)[0];

        expect(result.line      ).toEqual('${Resource.msg(\'field.billing.address.last.name\',\'address\',null)}');
        expect(result.lineNumber).toEqual(7);
        expect(result.globalPos ).toEqual(366);
        expect(result.length    ).toEqual(65);
        expect(result.rule      ).toEqual(rule.id);
        expect(result.message   ).toEqual(rule.description);
    });

    it('allows one element per line', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1, isCrlfLineBreak);

        expect(result).toEqual([]);
    });

    it('ignores container nodes', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 2, isCrlfLineBreak);

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
                indent : {
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

    it('sets Unix line breaks on autofix feature', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 0);

        expect(results.fixedTemplateContent.indexOf(Constants.lineBreak.windows)).toBe(-1);
    });

    it('does not raise an error if "iscomment" option is set as exception', () => {
        ConfigUtils.setRuleConfig('one-element-per-line', {
            except: ['iscomment']
        });

        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 3, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('raises an error if "iscomment" option is not set as exception', () => {
        ConfigUtils.setRuleConfig('one-element-per-line', {});

        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 3, isCrlfLineBreak);

        expect(result.length).toEqual(1);
    });

    it('does not raise an error if "non-tag" option is set as exception', () => {
        ConfigUtils.setRuleConfig('one-element-per-line', {
            except: ['non-tag']
        });

        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 4, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('raises an error if "non-tag" option is not set as exception', () => {
        ConfigUtils.setRuleConfig('one-element-per-line', {});

        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 4, isCrlfLineBreak);

        expect(result.length).toEqual(1);
    });

    it('does not raise an error if "non-tag" option is set as exception and elements are not in the same line', () => {
        ConfigUtils.setRuleConfig('one-element-per-line', {
            except: ['non-tag']
        });

        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 5, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });
});
