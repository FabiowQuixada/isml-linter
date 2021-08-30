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
        const CustomTagUtils = require('../../../../src/util/CustomTagUtils');

        expect(CustomTagUtils['isundefined']).toEqual(undefined);
    });

    it('allows module definitions to have "/>" in the same line as module last attribute', () => {
        const CustomTagUtils = require('../../../../src/util/CustomTagUtils');

        expect(CustomTagUtils['ismoduleone']).not.toEqual(undefined);
        expect(CustomTagUtils['ismoduletwo']).not.toEqual(undefined);
        expect(CustomTagUtils['ismodulethree']).not.toEqual(undefined);
    });
});
