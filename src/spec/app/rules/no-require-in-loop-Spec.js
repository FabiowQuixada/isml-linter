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
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0);

        expect(result).toEqual([{
            line        : '<isset name="basket" value="${require(\'dw.order.Basket\')}" scope="page"/>',
            lineNumber  : 3,
            columnStart : 80,
            length      : 82,
            rule        : rule.name,
            message     : rule.description
        }]);
    });

    it('allows "require()" calls outsde loops', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1);

        expect(result).toEqual([]);
    });

    it('allows loops with no "require()" calls', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 2);

        expect(result).toEqual([]);
    });
});
