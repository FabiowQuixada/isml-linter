const RulesHolder = require('../../app/RulesHolder');

describe('RulesHolder', () => {
    it('holds the correct number of rules', () => {
        expect(RulesHolder.rules.length).toBe(7); // TODO
    });
});
