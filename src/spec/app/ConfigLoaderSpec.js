const ConfigLoader = require('../../app/ConfigLoader');
const SpecHelper = require('../SpecHelper');
const Constants = require('../../app/Constants');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('loads test config', () => {
        process.env.NODE_ENV = Constants.ENV_TEST;

        const config = ConfigLoader.load();

        expect(config.env).toEqual('test');
    });

    it('loads dev config', () => {
        process.env.NODE_ENV = Constants.ENV_DEV;

        const config = ConfigLoader.load();

        expect(config.env).not.toEqual('test');
    });
});
