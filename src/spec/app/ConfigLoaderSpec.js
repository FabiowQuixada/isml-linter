const appRoot = require('app-root-path');
const reqlib = appRoot.require;
const ConfigLoader = reqlib('/src/app/ConfigLoader');
const SpecHelper = reqlib('/src/spec/SpecHelper');
const Constants = reqlib('/src/app/Constants');

describe('ConfigLoader', () => {

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
