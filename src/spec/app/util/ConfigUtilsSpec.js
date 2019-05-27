const path        = require('path');
const ConfigUtils = require('../../../app/util/ConfigUtils');
const SpecHelper  = require('../../SpecHelper');
const Constants   = require('../../../app/Constants');
// const FileUtils   = require('../../../app/util/FileUtils');

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

        const config = ConfigUtils.load();

        expect(config.env).toEqual('test');
    });

    it('loads dev config', () => {
        process.env.NODE_ENV = Constants.ENV_DEV;

        const config = ConfigUtils.load();

        expect(config.env).not.toEqual('test');
    });

    // TODO: Works on production
    // it to work on test environment also;
    // it('creates a config file if it does not exist', () => {
    //     const specTempDir = Constants.specTempDir;
    //     ConfigUtils.init(specTempDir);
    //     expect(FileUtils.fileExists(specTempDir)).toBe(true);
    // });

    // it('does not create a config file if it already exists', () => {

    //     const specTempDir = Constants.specTempDir;

    //     const firstAttempt  = ConfigUtils.init(specTempDir);
    //     const secondAttempt = ConfigUtils.init(specTempDir);

    //     expect(firstAttempt).toBe(true);
    //     expect(secondAttempt).toBe(false);
    // });

    it('loads a given, temporary configuration', () => {

        const expectedConfig = {
            rules: {
                'enforce-isprint': {},
                'no-inline-style': {}
            }
        };
        ConfigUtils.load(expectedConfig);

        const actualConfig = ConfigUtils.load();

        expect(actualConfig).toBe(expectedConfig);
    });

    it('clears given, temporary configuration', () => {

        ConfigUtils.load({
            rules: {
                'enforce-isprint': {},
                'no-inline-style': {}
            }
        });
        ConfigUtils.clearConfig();

        const specConfigPath = path.join(Constants.specDir, Constants.configPreferredFileName);
        const expectedConfig = require(specConfigPath);
        const actualConfig   = ConfigUtils.load();

        expect(actualConfig).toBe(expectedConfig);
    });
});
