const SpecHelper = require('../SpecHelper');
const Builder    = require('../../app/Builder');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('simulates production errorly scenario', () => {
        const result = Builder.run();

        expect(result).toEqual(1);
    });
});
