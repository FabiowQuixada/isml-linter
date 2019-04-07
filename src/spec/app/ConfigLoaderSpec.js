const path         = require('path');
const ConfigLoader = require('../../app/ConfigLoader');
const SpecHelper   = require('../SpecHelper');
const Constants    = require('../../app/Constants');
const FileUtils    = require('../../app/FileUtils');

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

    it('creates a config file if it does not exist', () => {

        const specTempDir = Constants.specTempDir;

        ConfigLoader.init(specTempDir);

        expect(FileUtils.fileExists(specTempDir)).toBe(true);
    });

    it('does not create a config file if it already exists', () => {

        const specTempDir = Constants.specTempDir;

        const firstAttempt  = ConfigLoader.init(specTempDir);
        const secondAttempt = ConfigLoader.init(specTempDir);

        expect(firstAttempt).toBe(true);
        expect(secondAttempt).toBe(false);
    });

    it('loads a given, temporary configuration', () => {

        const expectedConfig = {
            rules: {
                'enforce-isprint': {},
                'no-inline-style': {}
            }
        };
        ConfigLoader.load(expectedConfig);

        const actualConfig = ConfigLoader.load();

        expect(actualConfig).toBe(expectedConfig);
    });

    it('clears given, temporary configuration', () => {

        ConfigLoader.load({
            rules: {
                'enforce-isprint': {},
                'no-inline-style': {}
            }
        });
        ConfigLoader.clear();

        const specConfigPath = path.join(Constants.specDir, Constants.specConfigFileName);
        const expectedConfig = require(specConfigPath);
        const actualConfig   = ConfigLoader.load();

        expect(actualConfig).toBe(expectedConfig);
    });
});
