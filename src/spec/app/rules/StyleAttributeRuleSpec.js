const reqlib = require('app-root-path').require;
const SpecHelper = reqlib('/src/spec/SpecHelper');
const specFileName = require('path').basename(__filename);
const rule = reqlib('src/spec/SpecHelper').getRule(specFileName);

describe(rule.name, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects inadequate code', () => {
        const line = '<div style="display: none;">';

        expect(rule.isBroken(line)).toBe(true);
    });

    it('ignores empty lines', () => {
        const line = '<div class="hidden">';

        expect(rule.isBroken(line)).toBe(false);
    });
});
