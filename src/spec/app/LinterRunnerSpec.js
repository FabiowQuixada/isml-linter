const SpecHelper = require('../SpecHelper');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('lints ISML files in a given directory', () => {
        const issueQty = require('../../app/LinterRunner');

        expect(issueQty).toEqual(7);
    });
});
