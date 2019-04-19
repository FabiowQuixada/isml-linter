const SpecHelper  = require('../SpecHelper');
const IsmlLinter  = require('../../app/IsmlLinter');
const Builder     = require('../../app/Builder');
const ConfigUtils = require('../../app/util/ConfigUtils');
const Constants   = require('../../app/Constants');

const publicApi   = require('../../app/publicApi');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('lints path', () => {
        const path           = Constants.specSpecificDirLinterTemplate;
        const actualResult   = publicApi.parse(path);
        const expectedResult = IsmlLinter.run(path);

        expect(actualResult).toEqual(expectedResult);
    });

    it('builds path', () => {
        const actualResult   = publicApi.build();
        const expectedResult = Builder.run();

        expect(actualResult).toEqual(expectedResult);
    });

    it('sets config', () => {
        const path           = '../publicApi_config.json';
        const config         = require(path);
        const actualResult   = publicApi.setConfig(config);
        const expectedResult = ConfigUtils.load(config);

        expect(actualResult).toEqual(expectedResult);
        expect(actualResult).toEqual(config);
    });

    it('uses defined config', () => {
        const path               = '../publicApi_config.json';
        const config             = require(path);
        const actualResult       = publicApi.setConfig(config);
        const expectedResult     = ConfigUtils.load(config);
        const lintPath           = Constants.specSpecificDirLinterTemplate;
        const actualLintResult   = publicApi.parse(lintPath);
        const expectedLintResult = IsmlLinter.run(lintPath);

        expect(actualResult).toEqual(expectedResult);
        expect(actualResult).toEqual(config);
        expect(actualLintResult).toEqual(expectedLintResult);
    });
});
