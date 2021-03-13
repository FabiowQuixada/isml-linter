const specFileName = require('path').basename(__filename);
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

    it('identifies a reverse tabnabbing security hole', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0, isCrlfLineBreak)[0];

        expect(result.line        ).toEqual('<a href="http://example.com" target="_blank">');
        expect(result.lineNumber  ).toEqual(1);
        expect(result.columnNumber).toEqual(1);
        expect(result.globalPos   ).toEqual(0);
        expect(result.length      ).toEqual(45);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual('Potential reverse tabnabbing security hole detected. Consider adding \'rel="noopener"\'');
    });

    it('ignores reverse-tabnabbing-safe elements', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('identifies a reverse tabnabbing security hole in a multiline element', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 2, isCrlfLineBreak)[0];

        expect(result.line        ).toEqual('<a \n    href="http://example.com"\n    target="_blank"\n    class="some-class"\n>');
        expect(result.lineNumber  ).toEqual(1);
        expect(result.columnNumber).toEqual(1);
        expect(result.globalPos   ).toEqual(0);
        expect(result.length      ).toEqual(78);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual('Potential reverse tabnabbing security hole detected. Consider adding \'rel="noopener"\'');
    });

    it('ignores reverse-tabnabbing-safe multi-line elements', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 3, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('ignores reverse-tabnabbing checking if disabled', () => {
        ConfigUtils.load({
            rules: {
                'prevent-reverse-tabnabbing' : false
            }
        });
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 3, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('allows "rel" attribute to have multiple values when preventing reverse tabnabbing', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 4, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });
});
