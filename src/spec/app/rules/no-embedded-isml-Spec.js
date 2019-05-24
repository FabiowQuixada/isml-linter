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

    it('detects non-isprint tags within html tags', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(result.line      ).toEqual('<input\n    type="text"\n    class="form-control <isif condition="${condition}">billingAddressCity</isif>"\n    id="billingAddressCity"\n    autocomplete="billing address-level2"/>');
        expect(result.lineNumber).toEqual(1);
        expect(result.globalPos ).toEqual(0);
        expect(result.length    ).toEqual(176);
        expect(result.rule      ).toEqual(rule.name);
        expect(result.message   ).toEqual(rule.description);
    });

    it('allows isml-tag-less html tags', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1);

        expect(result).toEqual([]);
    });

    it('allows isprint tags within html tags', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 2);

        expect(result).toEqual([]);
    });
});
