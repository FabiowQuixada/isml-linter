const SpecHelper = require('../SpecHelper');
const RulesHolder = require('../../app/RulesHolder');
const Constants = require('../../app/Constants');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('holds the correct number of rules', () => {
        expect(RulesHolder.getAllRules().length).toBe(numberOfRules());
    });
});

const numberOfRules = () => {
    let result = 0;

    require('fs')
        .readdirSync(Constants.rulesDir)
        .filter( file => file.endsWith('Rule.js'))
        .forEach( () => {
            result += 1;
        });

    return result;
};
