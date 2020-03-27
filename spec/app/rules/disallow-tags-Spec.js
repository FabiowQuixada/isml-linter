const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../SpecHelper');

const rule = SpecHelper.getTreeRule(specFileName);

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('disallows config-defined tags', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0);

        expect(result.length).toEqual(2);
        expect(result[0].message).toEqual('Tag "isscript" is not allowed.');
        expect(result[1].message).toEqual('Tag "style" is not allowed.');
    });

    it('allows non-config-defined tags', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1);

        expect(result.length).toEqual(0);
    });

    it('ignores non-tag elements', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 2);

        expect(result.length).toEqual(0);
    });
});
