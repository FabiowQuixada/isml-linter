const path        = require('path');
const sinon       = require('sinon');
const chalk       = require('chalk');
const SpecHelper  = require('../SpecHelper');
const IsmlLinter  = require('../../src/IsmlLinter');
const Builder     = require('../../src/Builder');
const ConfigUtils = require('../../src/util/ConfigUtils');
const Constants   = require('../../src/Constants');
const publicApi   = require('../../src/publicApi');

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

        // Ignores elapsed time data;
        delete actualResult.elapsedTime;
        delete expectedResult.elapsedTime;

        expect(actualResult).toEqual(expectedResult);
    });

    it('builds path', () => {
        const actualResult   = publicApi.build('./cartridges');
        const expectedResult = Builder.run('./cartridges');

        expect(actualResult).toEqual(expectedResult);
    });

    it('sets config', () => {
        const configPath = '../publicApi_config.json';
        const config     = require(configPath);

        publicApi.setConfig(config);

        const actualResult   = publicApi.getConfig();
        const expectedResult = ConfigUtils.load(config);

        expect(actualResult).toEqual(expectedResult);
        expect(actualResult).toEqual(config);
    });

    it('uses defined config', () => {
        const configPath = '../publicApi_config.json';
        const config     = require(configPath);

        publicApi.setConfig(config);

        const actualResult       = publicApi.getConfig();
        const expectedResult     = ConfigUtils.load(config);
        const lintPath           = Constants.specSpecificDirLinterTemplate;
        const actualLintResult   = publicApi.parse(lintPath);
        const expectedLintResult = IsmlLinter.run(lintPath);

        // Ignores elapsed time data;
        delete actualLintResult.elapsedTime;
        delete expectedLintResult.elapsedTime;

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

    it('prints lint result', () => {
        const spy             = sinon.spy(console, 'log');
        const dirPath         = Constants.specSpecificDirLinterTemplate;
        const expectedMessage = chalk`{cyan.bold ${Constants.EOL}The following linting info items were found in the templates:}`;

        publicApi.parse(dirPath);
        publicApi.printResults();

        expect(spy.getCall(0).args[0]).toEqual(expectedMessage);

        spy.restore();
    });
});
