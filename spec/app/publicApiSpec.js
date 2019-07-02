const path        = require('path');
const SpecHelper  = require('../SpecHelper');
const IsmlLinter  = require('../../src/app/IsmlLinter');
const Builder     = require('../../src/app/Builder');
const ConfigUtils = require('../../src/app/util/ConfigUtils');
const Constants   = require('../../src/app/Constants');
const publicApi   = require('../../src/app/publicApi');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('lints path', () => {
        const dirPath        = Constants.specSpecificDirLinterTemplate;
        const actualResult   = publicApi.parse(dirPath);
        const expectedResult = IsmlLinter.run(dirPath);

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

        expect(actualResult    ).toEqual(expectedResult);
        expect(actualResult    ).toEqual(config);
        expect(actualLintResult).toEqual(expectedLintResult);
    });

    it('parses dynamic content, if passed as parameter', () => {
        const content      = '<br/>';
        const templatePath = path.join(Constants.specSpecificDirLinterTemplate, 'template_3.isml');
        const result       = publicApi.parse(templatePath, content);
        const errorQty     = Object.keys(result.errors).length;

        expect(errorQty).toEqual(1);
    });
});
