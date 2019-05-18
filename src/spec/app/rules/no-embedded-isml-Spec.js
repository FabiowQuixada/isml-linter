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
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0);

        expect(result).toEqual([{
            line        : '<input\n    type="text"\n    class="form-control <isif condition="${condition}">billingAddressCity</isif>"\n    id="billingAddressCity"\n    autocomplete="billing address-level2"/>',
            lineNumber  : 1,
            globalPos : 0,
            length      : 176,
            rule        : rule.name,
            message     : rule.description
        }]);
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
