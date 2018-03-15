const reqlib = require('app-root-path').require;
const RulesHolder = reqlib('src/app/RulesHolder');

describe('RulesHolder', () => {
    it('holds the correct number of rules', () => {
        expect(RulesHolder.rules.length).toBe(7); // TODO
    });
});
