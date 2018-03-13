const specFileName = require('path').basename(__filename);
const rule = require('../../SpecHelper').getRule(specFileName);

describe(rule.name, () => {
    it('detects inadequate code', () => {
        let line = '<a class="logout_mobile_link">${dw.web.Resource.msg(\'global.logout\',\'locale\',null)}</a>';

        expect(rule.isBroken(line)).toBe(true);

        line = '                             ${pdict.CurrentCustomer.profile.firstName}';

        expect(rule.isBroken(line)).toBe(true);
    });

    it('accepts good code', () => {
        const line = '<label><isprint value="${Resource.msg(\'reorder.sortbyproducttype\',\'reorder\',null)}" /></label>';

        expect(rule.isBroken(line)).toBe(false);
    });

    it('accepts code that is not related to the rule', () => {
        const line = 'if (category == null && pdict.Product != null) {';

        expect(rule.isBroken(line)).toBe(false);
    });
});
