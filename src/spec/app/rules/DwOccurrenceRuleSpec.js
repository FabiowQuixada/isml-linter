const SpecHelper = require('../../SpecHelper');
const specFileName = require('path').basename(__filename);
const rule = SpecHelper.getRule(specFileName);
const FileParser = require('../../../app/FileParser');

describe(rule.name, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects inadequate code', () => {
        const file = SpecHelper.getRuleSpecTemplate(rule, 0);

        expect(rule.check(file, FileParser)).toBe(true);
    });

    it('detects inadequate code in the middle of the line', () => {
        const file = SpecHelper.getRuleSpecTemplate(rule, 1);

        expect(rule.check(file, FileParser)).toBe(true);
    });

    it('accepts good code', () => {
        const file = SpecHelper.getRuleSpecTemplate(rule, 2);

        expect(rule.check(file, FileParser)).toBe(false);
    });

    it('accepts code that is not related to the rule', () => {
        const file = SpecHelper.getRuleSpecTemplate(rule, 3);

        expect(rule.check(file, FileParser)).toBe(false);
    });
});
