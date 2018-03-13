const specFileName = require('path').basename(__filename);
const rule = require('../../SpecHelper').getRule(specFileName);

describe(rule.name, () => {
    it('detects inadequate code', () => {
        let line = 'var category : dw.catalog.Category;';

        expect(rule.isBroken(line)).toBe(true);

        line = '<a href="${dw.catalog.ProductSearchModel.urlForCategory(\'Search-Show\',cat.ID)}"';

        expect(rule.isBroken(line)).toBe(true);
    });

    it('accepts good code', () => {
        const line = 'var order = require(\'dw/order/OrderMgr\').getOrder(session.privacy.lastOrderNo);';

        expect(rule.isBroken(line)).toBe(false);
    });

    it('accepts code that is not related to the rule', () => {
        const line = 'if (category == null && pdict.Product != null) {';

        expect(rule.isBroken(line)).toBe(false);
    });
});
