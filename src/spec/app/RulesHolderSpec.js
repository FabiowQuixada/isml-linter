const reqlib = require('app-root-path').require;
const SpecHelper = reqlib('/src/spec/SpecHelper');
const RulesHolder = reqlib('src/app/RulesHolder');

describe('RulesHolder', () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('holds the correct number of rules', () => {
        expect(RulesHolder.rules.length).toBe(7); // TODO
    });
});
