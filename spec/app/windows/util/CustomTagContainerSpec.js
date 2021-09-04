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
        const CustomTagContainer = require('../../../../src/util/CustomTagContainer');

        expect(CustomTagContainer['isundefined']).toEqual(undefined);
    });

    it('allows module definitions to have "/>" in the same line as module last attribute', () => {
        const CustomTagContainer = require('../../../../src/util/CustomTagContainer');

        expect(CustomTagContainer['ismoduleone']).not.toEqual(undefined);
        expect(CustomTagContainer['ismoduletwo']).not.toEqual(undefined);
        expect(CustomTagContainer['ismodulethree']).not.toEqual(undefined);
    });
});
