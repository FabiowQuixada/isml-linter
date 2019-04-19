const SpecHelper = require('../SpecHelper');
const RuleUtils  = require('../../app/RuleUtils');
const Constants  = require('../../app/Constants');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('holds the correct number of rules', () => {
        expect(RuleUtils.getAllLineRules().length).toBe(numberOfRules());
    });
});

const numberOfRules = () => {
    let result = 0;

    require('fs')
        .readdirSync(Constants.lineByLineRulesDir)
        .filter( file => file.endsWith('.js'))
        .forEach( () => {
            result += 1;
        });

    return result;
};
