const path         = require('path');
const specFileName = path.basename(__filename);
const SpecHelper   = require('../../SpecHelper');
const rule         = SpecHelper.getTreeRule(specFileName);
const ConfigUtils  = require('../../../src/app/util/ConfigUtils');
const Constants    = require('../../../src/app/Constants');

const specEslintConfig =  require(path.join('..', '..', Constants.eslintConfigFileName));

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
        ConfigUtils.loadEslintConfig(specEslintConfig);
        rule.occurrences       = [];
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('identifies the simplest eslint case', () => {
        const result          = SpecHelper.parseAndApplyRuleToTemplate(rule, 0);
        const firstOccurrence = result[0];

        expect(firstOccurrence.line      ).toEqual('    let foo = bar;    ');
        expect(firstOccurrence.lineNumber).toEqual(2);
        expect(firstOccurrence.globalPos ).toEqual(15);
        expect(firstOccurrence.length    ).toEqual(18);
        expect(firstOccurrence.rule      ).toEqual(rule.id);
        expect(firstOccurrence.message   ).toEqual('Trailing spaces not allowed.');
    });

    it('identifies a second eslint occurrence', () => {
        const secondOccurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[1];

        expect(secondOccurrence.line      ).toEqual('    let bar = baz;  ');
        expect(secondOccurrence.lineNumber).toEqual(4);
        expect(secondOccurrence.globalPos ).toEqual(39);
        expect(secondOccurrence.length    ).toEqual(16);
        expect(secondOccurrence.rule      ).toEqual(rule.id);
        expect(secondOccurrence.message   ).toEqual('Trailing spaces not allowed.');
    });

    it('identifies a complex eslint occurrence', () => {
        const firstOccurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 1)[0];

        expect(firstOccurrence.line      ).toEqual('           disabledAttr = \' disabled="disabled"\';  ');
        expect(firstOccurrence.lineNumber).toEqual(12);
        expect(firstOccurrence.globalPos ).toEqual(476);
        expect(firstOccurrence.length    ).toEqual(40);
        expect(firstOccurrence.rule      ).toEqual(rule.id);
        expect(firstOccurrence.message   ).toEqual('Expected indentation of 8 spaces but found 7.');
    });

    it('identifies a simple eslint "var" occurrence', () => {
        const result           = SpecHelper.parseAndApplyRuleToTemplate(rule, 3);
        const firstOccurrence  = result[0];
        const secondOccurrence = result[1];

        expect(firstOccurrence.line      ).toEqual('    var product = pdict.Product;');
        expect(firstOccurrence.lineNumber).toEqual(2);
        expect(firstOccurrence.globalPos ).toEqual(15);
        expect(firstOccurrence.length    ).toEqual(28);
        expect(firstOccurrence.rule      ).toEqual(rule.id);
        expect(firstOccurrence.message   ).toEqual('Unexpected var, use let or const instead.');

        expect(secondOccurrence.line      ).toEqual('    var pid = pdict.Product.getID();');
        expect(secondOccurrence.lineNumber).toEqual(3);
        expect(secondOccurrence.globalPos ).toEqual(48);
        expect(secondOccurrence.length    ).toEqual(32);
        expect(secondOccurrence.rule      ).toEqual(rule.id);
        expect(secondOccurrence.message   ).toEqual('Unexpected var, use let or const instead.');
    });

    it('identifies a complex eslint "var" occurrence', () => {
        const firstOccurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 2)[0];

        expect(firstOccurrence.line      ).toEqual('    var pid = pdict.Product.getID();');
        expect(firstOccurrence.lineNumber).toEqual(3);
        expect(firstOccurrence.globalPos ).toEqual(48);
        expect(firstOccurrence.length    ).toEqual(32);
        expect(firstOccurrence.rule      ).toEqual(rule.id);
        expect(firstOccurrence.message   ).toEqual('Unexpected var, use let or const instead.');
    });

    it('identifies a complex eslint "var" occurrence in a complex template', () => {
        const firstOccurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 4)[0];

        expect(firstOccurrence.line      ).toEqual('    var pid = pdict.Product.getID();');
        expect(firstOccurrence.lineNumber).toEqual(110);
        expect(firstOccurrence.globalPos ).toEqual(4058);
        expect(firstOccurrence.length    ).toEqual(32);
        expect(firstOccurrence.rule      ).toEqual(rule.id);
        expect(firstOccurrence.message   ).toEqual('Unexpected var, use let or const instead.');
    });

    it('fixes a simple template', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 0);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('fixes a complex script in the template', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 1);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('fixes a complex script in a complex template', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 2);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('fixes all <isscript> tags in the template', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 3);

        expect(results.actualContent).toEqual(results.fixedTemplateContent);
    });

    it('sets Unix line breaks on autofix feature', () => {
        const results = SpecHelper.getTreeRuleFixData(rule, 0);

        expect(results.fixedTemplateContent.indexOf(Constants.lineBreak.windows)).toBe(-1);
    });
});
