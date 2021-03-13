const path             = require('path');
const specFileName     = path.basename(__filename);
const SpecHelper       = require('../../../SpecHelper');
const ConfigUtils      = require('../../../../src/util/ConfigUtils');
const Constants        = require('../../../../src/Constants');
const specEslintConfig = require(path.join('..', '..', '..', Constants.eslintConfigFileNameList[0]));

const rule            = SpecHelper.getTreeRule(specFileName);
const isCrlfLineBreak = true;

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
        ConfigUtils.loadEslintConfig(specEslintConfig);
        rule.occurrenceList       = [];
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('identifies the simplest eslint case', () => {
        const result          = SpecHelper.parseAndApplyRuleToTemplate(rule, 0, isCrlfLineBreak);
        const firstOccurrence = result[0];

        expect(firstOccurrence.line        ).toEqual('    let foo = bar;    ');
        expect(firstOccurrence.lineNumber  ).toEqual(2);
        expect(firstOccurrence.columnNumber).toEqual(5);
        expect(firstOccurrence.globalPos   ).toEqual(16);
        expect(firstOccurrence.length      ).toEqual(18);
        expect(firstOccurrence.rule        ).toEqual(rule.id);
        expect(firstOccurrence.message     ).toEqual('Trailing spaces not allowed.');
    });

    it('identifies a second eslint occurrence', () => {
        const secondOccurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 0, isCrlfLineBreak)[1];

        expect(secondOccurrence.line        ).toEqual('    let bar = baz;  ');
        expect(secondOccurrence.lineNumber  ).toEqual(4);
        expect(secondOccurrence.columnNumber).toEqual(5);
        expect(secondOccurrence.globalPos   ).toEqual(42);
        expect(secondOccurrence.length      ).toEqual(16);
        expect(secondOccurrence.rule        ).toEqual(rule.id);
        expect(secondOccurrence.message     ).toEqual('Trailing spaces not allowed.');
    });

    it('identifies a complex eslint occurrence', () => {
        const firstOccurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 1, isCrlfLineBreak)[0];

        expect(firstOccurrence.line        ).toEqual('           disabledAttr = \' disabled="disabled"\';  ');
        expect(firstOccurrence.lineNumber  ).toEqual(12);
        expect(firstOccurrence.columnNumber).toEqual(5);
        expect(firstOccurrence.globalPos   ).toEqual(476);
        expect(firstOccurrence.length      ).toEqual(11);
        expect(firstOccurrence.rule        ).toEqual(rule.id);
        expect(firstOccurrence.message     ).toEqual('Expected indentation of 12 spaces but found 11.');
    });

    it('identifies a simple eslint "var" occurrence', () => {
        const result           = SpecHelper.parseAndApplyRuleToTemplate(rule, 3, isCrlfLineBreak);
        const firstOccurrence  = result[0];
        const secondOccurrence = result[1];

        expect(firstOccurrence.line        ).toEqual('    var product = pdict.Product;');
        expect(firstOccurrence.lineNumber  ).toEqual(2);
        expect(firstOccurrence.columnNumber).toEqual(5);
        expect(firstOccurrence.globalPos   ).toEqual(16);
        expect(firstOccurrence.length      ).toEqual(28);
        expect(firstOccurrence.rule        ).toEqual(rule.id);
        expect(firstOccurrence.message     ).toEqual('Unexpected var, use let or const instead.');

        expect(secondOccurrence.line        ).toEqual('    var pid = pdict.Product.getID();');
        expect(secondOccurrence.lineNumber  ).toEqual(3);
        expect(secondOccurrence.columnNumber).toEqual(5);
        expect(secondOccurrence.globalPos   ).toEqual(50);
        expect(secondOccurrence.length      ).toEqual(32);
        expect(secondOccurrence.rule        ).toEqual(rule.id);
        expect(secondOccurrence.message     ).toEqual('Unexpected var, use let or const instead.');
    });

    it('identifies a complex eslint "var" occurrence', () => {
        const firstOccurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 2, isCrlfLineBreak)[0];

        expect(firstOccurrence.line        ).toEqual('    var pid = pdict.Product.getID();');
        expect(firstOccurrence.lineNumber  ).toEqual(3);
        expect(firstOccurrence.columnNumber).toEqual(5);
        expect(firstOccurrence.globalPos   ).toEqual(50);
        expect(firstOccurrence.length      ).toEqual(32);
        expect(firstOccurrence.rule        ).toEqual(rule.id);
        expect(firstOccurrence.message     ).toEqual('Unexpected var, use let or const instead.');
    });

    it('identifies a complex eslint "var" occurrence in a complex template', () => {
        const firstOccurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 4, isCrlfLineBreak)[0];

        expect(firstOccurrence.line        ).toEqual('    var pid = pdict.Product.getID();');
        expect(firstOccurrence.lineNumber  ).toEqual(110);
        expect(firstOccurrence.columnNumber).toEqual(5);
        expect(firstOccurrence.globalPos   ).toEqual(4167);
        expect(firstOccurrence.length      ).toEqual(32);
        expect(firstOccurrence.rule        ).toEqual(rule.id);
        expect(firstOccurrence.message     ).toEqual('Unexpected var, use let or const instead.');
    });

    it('identifies occurrence global position', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 5, isCrlfLineBreak);

        expect(result[0].globalPos).toEqual(47);
        expect(result[1].globalPos).toEqual(73);
    });

    it('identifies occurrence global position II', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 6, isCrlfLineBreak);

        expect(result[0].globalPos).toEqual(47);
        expect(result[1].globalPos).toEqual(73);
        expect(result[2].globalPos).toEqual(99);
        expect(result[3].globalPos).toEqual(127);
    });

    it('identifies eslint parsing issues', () => {
        const result          = SpecHelper.parseAndApplyRuleToTemplate(rule, 7, isCrlfLineBreak);
        const firstOccurrence = result[0];

        expect(firstOccurrence.line        ).toEqual('        vfar variableTwo = 2;');
        expect(firstOccurrence.lineNumber  ).toEqual(4);
        expect(firstOccurrence.columnNumber).toEqual(5);
        expect(firstOccurrence.globalPos   ).toEqual(26);
        expect(firstOccurrence.length      ).toEqual(21);
        expect(firstOccurrence.rule        ).toEqual(rule.id);
        expect(firstOccurrence.message     ).toEqual('Parsing error: Unexpected token variableTwo');
    });

    it('identifies eslint indentation issues', () => {
        const result           = SpecHelper.parseAndApplyRuleToTemplate(rule, 8, isCrlfLineBreak);
        const firstOccurrence  = result[0];
        const secondOccurrence = result[1];

        expect(firstOccurrence.line        ).toEqual('      const variableOne = 1;');
        expect(firstOccurrence.lineNumber  ).toEqual(2);
        expect(firstOccurrence.columnNumber).toEqual(7);
        expect(firstOccurrence.globalPos   ).toEqual(12);
        expect(firstOccurrence.length      ).toEqual(6);
        expect(firstOccurrence.rule        ).toEqual(rule.id);
        expect(firstOccurrence.message     ).toEqual('Expected indentation of 4 spaces but found 6.');

        expect(secondOccurrence.line        ).toEqual('       const variableTwo = 2;');
        expect(secondOccurrence.lineNumber  ).toEqual(3);
        expect(secondOccurrence.columnNumber).toEqual(7);
        expect(secondOccurrence.globalPos   ).toEqual(42);
        expect(secondOccurrence.length      ).toEqual(7);
        expect(secondOccurrence.rule        ).toEqual(rule.id);
        expect(secondOccurrence.message     ).toEqual('Expected indentation of 4 spaces but found 7.');
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
