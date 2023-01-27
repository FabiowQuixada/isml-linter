const path        = require('path');
const SpecHelper  = require('../../../SpecHelper');
const ConfigUtils = require('../../../../src/util/ConfigUtils');
const Constants   = require('../../../../src/Constants');
const RuleUtils   = require('../../../../src/util/RuleUtils');
const NoTabsRule  = require('../../../../src/rules/line_by_line/no-tabs');

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

    // TODO: Works on production
    // it to work on test environment also;
    // it('creates a config file if it does not exist', () => {
    //     const specTempDir = Constants.specTempDir;
    //     ConfigUtils.init(specTempDir);
    //     expect(FileUtils.fileExists(specTempDir)).toBe(true);
    // });

    it('creates a config file with all available rules', () => {
        const scaffoldConfig    = require('../../../../scaffold_files/ismllinter.config');
        const availableRulesQty = RuleUtils.getAvailableRulesQty();

        ConfigUtils.load(scaffoldConfig);
        const defaultConfigRules = Object.keys(ConfigUtils.load().rules);

        expect(defaultConfigRules.length).toEqual(availableRulesQty - 1);
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

        const specConfigPath = path.join(Constants.specDir, Constants.configFileNameList[0]);
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

    it('uses config Unix line endings', () => {
        ConfigUtils.load({
            linebreakStyle : 'unix',
            rules : {
                'no-tabs' : {}
            }
        });

        const results = SpecHelper.getLineRuleFixData(NoTabsRule, 0);

        expect(results.fixedTemplateContent.indexOf(Constants.lineBreak.unix)).not.toBe(-1);
        expect(results.fixedTemplateContent.indexOf(Constants.lineBreak.windows)).toBe(-1);
    });

    it('uses config Windows line endings', () => {
        ConfigUtils.load({
            linebreakStyle : 'windows',
            rules : {
                'no-tabs' : {}
            }
        });

        const results = SpecHelper.getLineRuleFixData(NoTabsRule, 0);

        expect(results.fixedTemplateContent.indexOf(Constants.lineBreak.windows)).not.toBe(-1);
    });

    it('keeps template original line break (CRLF)', () => {
        ConfigUtils.load({
            rules : {
                'no-tabs' : {}
            }
        });

        const results = SpecHelper.getLineRuleFixData(NoTabsRule, 0);

        expect(results.fixedTemplateContent.indexOf(Constants.lineBreak.unix)).toBe(24);
        expect(results.fixedTemplateContent.indexOf(Constants.lineBreak.windows)).not.toBe(-1);
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
