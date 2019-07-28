const path        = require('path');
const SpecHelper  = require('../../SpecHelper');
const ConfigUtils = require('../../../src/app/util/ConfigUtils');
const Constants   = require('../../../src/app/Constants');
const RuleUtils   = require('../../../src/app/util/RuleUtils');

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

    it('creates a config file with all available rules', () => {
        const scaffoldConfig    = require('../../../scaffold_files/ismllinter.config');
        const availableRulesQty = RuleUtils.getAvailableRulesQty();

        ConfigUtils.load(scaffoldConfig);
        const defaultConfigRules = Object.keys(ConfigUtils.load().rules);

        expect(defaultConfigRules.length).toEqual(availableRulesQty);
    });

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

    it('loads eslint config', () => {
        process.env.NODE_ENV = Constants.ENV_DEV;

        const eslintConfig = ConfigUtils.loadEslintConfig();

        expect(eslintConfig.env).not.toEqual('test');
    });

    it('loads a given, temporary eslint configuration', () => {
        const expectedEslintConfig = getSpecEslintConfig();
        ConfigUtils.loadEslintConfig(expectedEslintConfig);

        const actualEslintConfig = ConfigUtils.loadEslintConfig();

        expect(actualEslintConfig).toEqual(expectedEslintConfig);
    });
});

const getSpecEslintConfig = () => {
    return {
        'env': {
            'browser': true,
            'es6': true,
            'node': true
        },
        'extends': [
            'eslint:recommended',
            'plugin:varspacing/recommended',
            'plugin:jasmine/recommended'
        ],
        'parserOptions': {
            'ecmaVersion': 2018,
            'sourceType': 'module'
        },
        'rules': {
            'indent': ['error'],
            'no-trailing-spaces': ['error', { 'skipBlankLines': false }],
            'no-var': ['error']
        }
    };
};
