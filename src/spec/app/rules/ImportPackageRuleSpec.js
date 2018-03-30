const reqlib = require('app-root-path').require;
const SpecHelper = reqlib('/src/spec/SpecHelper');
const specFileName = require('path').basename(__filename);
const rule = reqlib('src/spec/SpecHelper').getRule(specFileName);
const FileParser = reqlib('/src/app/FileParser');

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

    it('accepts code that is not related to the rule', () => {
        const file = SpecHelper.getRuleSpecTemplate(rule, 1);

        expect(rule.check(file, FileParser)).toBe(false);
    });
});
