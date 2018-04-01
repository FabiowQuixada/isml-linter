const SpecHelper = require('../SpecHelper');
const RulesHolder = require('../../app/RulesHolder');
const Constants = require('../../app/Constants');

describe('RulesHolder', () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('holds the correct number of rules', () => {
        expect(RulesHolder.rules.length).toBe(numberOfRules());
    });
});

const numberOfRules = () => {
    let result = 0;

    require('fs').readdirSync(Constants.rulesDir).forEach( () => {
        result += 1;
    });

    return result;
};
