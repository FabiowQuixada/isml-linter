const SpecHelper = require('../../../SpecHelper');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('identifies custom modules defined under "modules.isml"', () => {
        const CustomTagUtils  = require('../../../../src/util/CustomTagUtils');

        expect(CustomTagUtils['isundefined']).toEqual(undefined);
    });
});
