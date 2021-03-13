const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../../SpecHelper');

const rule = SpecHelper.getTreeRule(specFileName);

describe('On Unix, ' + rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects "require()" calls within loops', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(result.line        ).toEqual('<isset name="basket" value="${require(\'dw.order.Basket\')}" scope="page"/>');
        expect(result.lineNumber  ).toEqual(3);
        expect(result.columnNumber).toEqual(39);
        expect(result.globalPos   ).toEqual(110);
        expect(result.length      ).toEqual(26);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual(rule.description);
    });

    it('allows "require()" calls outside loops', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1);

        expect(result).toEqual([]);
    });

    it('allows loops with no "require()" calls', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 2);

        expect(result).toEqual([]);
    });

    it('provides occurrence global position', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 3)[0];

        expect(result.globalPos).toEqual(72);
    });

    it('provides occurrence global position II', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 4)[0];

        expect(result.globalPos).toEqual(152);
    });

    it('provides occurrence length', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 3)[0];

        expect(result.length).toEqual(20);
    });
});
