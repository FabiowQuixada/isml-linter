const SpecHelper  = require('../../SpecHelper');
const Builder     = require('../../../src/Builder');
const ConfigUtils = require('../../../src/util/ConfigUtils');
const path        = require('path');

const targetPath = path.join('cartridges', 'a_single_cartridge_project');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('simulates production buggy scenario', () => {
        const result = Builder.run(targetPath);

        expect(result).toEqual(1);
    });

    it('simulates production buggy scenario with ignored files', () => {
        ConfigUtils.load({
            ignore: [
                'cartridge/templates/default/folder/invalid_templates/invalid_template_0.isml'
            ]
        });

        const result = Builder.run(targetPath);

        expect(result).toEqual(1);
    });
});
