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
        const line = 'const sum = 0; ';

        expect(rule.isBroken(line)).toBe(true);
    });

    it('does not apply to spaces-only lines', () => {
        const line = '     ';

        expect(rule.isBroken(line)).toBe(false);
    });

    it('does not apply to empty lines', () => {
        const line = '';

        expect(rule.isBroken(line)).toBe(false);
    });

    it('accepts good code', () => {
        const line = 'var batchSize = require(\'pref\').get(\'reorder.batchSize\');';

        expect(rule.isBroken(line)).toBe(false);
    });
});
