const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../../SpecHelper');
const Constants    = require('../../../../src/Constants');

const rule = SpecHelper.getTreeRule(specFileName);

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects non-isprint tags within html tags', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(result.line      ).toEqual(`<input${Constants.EOL}    type="text"${Constants.EOL}    class="form-control <isif condition="\${condition}">billingAddressCity</isif>"${Constants.EOL}    id="billingAddressCity"${Constants.EOL}    autocomplete="billing address-level2"/>`);
        expect(result.lineNumber).toEqual(1);
        expect(result.globalPos ).toEqual(0);
        expect(result.length    ).toEqual(180);
        expect(result.rule      ).toEqual(rule.id);
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
