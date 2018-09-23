const SpecHelper = require('./SpecHelper');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('exports Isml Linter', () => {
        const indexObj = require('../../index');

        expect(indexObj.IsmlLinter).not.toBeNull();
    });


    it('exports File Parser Linter', () => {
        const indexObj = require('../../index');

        expect(indexObj.FileParser).not.toBeNull();
    });
});
