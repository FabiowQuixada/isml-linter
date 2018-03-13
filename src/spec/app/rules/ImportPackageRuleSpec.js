const specFileName = require('path').basename(__filename);
const rule = require('../../SpecHelper').getRule(specFileName);

describe(rule.name, () => {
    it('detects inadequate code', () => {
        const line = 'importPackage( dw.system );';

        expect(rule.isBroken(line)).toBe(true);
    });

    it('accepts code that is not related to the rule', () => {
        const line = 'if (category == null && pdict.Product != null) {';

        expect(rule.isBroken(line)).toBe(false);
    });
});
