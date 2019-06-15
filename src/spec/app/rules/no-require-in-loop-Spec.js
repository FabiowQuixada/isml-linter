const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../SpecHelper');
const rule         = SpecHelper.getTreeRule(specFileName);

describe(rule.name, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects "require()" calls within loops', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(result.line      ).toEqual('<isset name="basket" value="${require(\'dw.order.Basket\')}" scope="page"/>');
        expect(result.lineNumber).toEqual(3);
        expect(result.globalPos ).toEqual(80 + SpecHelper.getEolOffset(result.lineNumber));
        expect(result.length    ).toEqual(73);
        expect(result.rule      ).toEqual(rule.name);
        expect(result.message   ).toEqual(rule.description);
    });

    it('allows "require()" calls outside loops', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1);

        expect(result).toEqual([]);
    });

    it('allows loops with no "require()" calls', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 2);

        expect(result).toEqual([]);
    });
});
