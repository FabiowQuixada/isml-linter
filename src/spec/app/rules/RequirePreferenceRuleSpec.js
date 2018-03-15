const reqlib = require('app-root-path').require;
const specFileName = require('path').basename(__filename);
const rule = reqlib('src/spec/SpecHelper').getRule(specFileName);

describe(rule.name, () => {
    it('detects inadequate code', () => {
        const line = '<button>${dw.web.Resource.msg(\'product.storelocator\',\'_preferences\',null)}</button>';

        expect(rule.isBroken(line)).toBe(true);
    });

    it('accepts good code', () => {
        const line = 'var batchSize = require(\'pref\').get(\'reorder.batchSize\');';

        expect(rule.isBroken(line)).toBe(false);
    });

    it('accepts code that is not related to the rule', () => {
        const line = 'if (category == null && pdict.Product != null) {';

        expect(rule.isBroken(line)).toBe(false);
    });
});
