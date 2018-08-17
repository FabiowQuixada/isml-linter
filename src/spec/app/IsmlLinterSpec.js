const path = require('path');
const IsmlLinter = require('../../app/IsmlLinter');
const SpecHelper = require('../SpecHelper');
const Constants = require('../../app/Constants');
const SpacesOnlyLineRule = require('../../app/rules/SpacesOnlyLineRule');
const StyleAttributeRule = require('../../app/rules/StyleAttributeRule');
const IsprintTagRule = require('../../app/rules/IsprintTagRule');
const FileParser = require('../../app/FileParser');

const ismlSpecDir = Constants.ismlLinterSpecDir;
const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('lints ISML files in a given directory', () => {
        const result = IsmlLinter.run(ismlSpecDir);

        expect(result).toEqual(expectedResultObj('errors'));
    });

    it('ignores files under the node_modules/ directory', () => {
        IsmlLinter.run(ismlSpecDir);

        const output = JSON.stringify(IsmlLinter.getOutput());

        expect(output.indexOf('node_modules')).toBe(-1);
    });

    it('processes the correct line in result json data', () => {
        const result = IsmlLinter.run(ismlSpecDir);

        expect(result).toEqual(expectedResultObj(FileParser.ENTRY_TYPES.ERROR));
    });
});

const expectedResultObj = type => {
    const result = {};
    result[type] = {};

    const inlineStyleRuleDesc = StyleAttributeRule.description;
    const blankLineRuleDesc = SpacesOnlyLineRule.description;
    const isprintRuleDesc = IsprintTagRule.description;

    const file0Path = path.join(...'/sample_file_1.isml'.split( '/' ));
    const file1Path = path.join(...'/sample_file_2.isml'.split( '/' ));
    const inlineStyleLine = {
        line: '<div style="display: none;">${addToCartUrl}</div>',
        lineNumber: 0,
        columnStart: 5,
        length: 5
    };
    const blankLine = {
        line: '   ',
        lineNumber: 1,
        columnStart: 50,
        length: 4
    };
    const isprintLine0 = {
        line: '<div style="display: none;">${addToCartUrl}</div>',
        lineNumber: 0,
        columnStart: 28,
        length: 15
    };
    const isprintLine1 = {
        line: ' ${URLUtils.https(\'Reorder-ListingPage\')}',
        lineNumber: 0,
        columnStart: 1,
        length: 40
    };

    result[type][isprintRuleDesc] = {};
    result[type][isprintRuleDesc][file0Path] = [];
    result[type][isprintRuleDesc][file0Path].push(isprintLine0);
    result[type][isprintRuleDesc][file1Path] = [];
    result[type][isprintRuleDesc][file1Path].push(isprintLine1);

    result[type][inlineStyleRuleDesc] = {};
    result[type][inlineStyleRuleDesc][file0Path] = [];
    result[type][inlineStyleRuleDesc][file0Path].push(inlineStyleLine);

    result[type][blankLineRuleDesc] = {};
    result[type][blankLineRuleDesc][file0Path] = [];
    result[type][blankLineRuleDesc][file0Path].push(blankLine);

    return result;
};
