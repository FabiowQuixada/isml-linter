const path = require('path');
const FileParser = require('../../app/FileParser');
const SpecHelper = require('../SpecHelper');
const Constants = require('../../app/Constants');
const LogicInTemplateRule = require('../../app/rules/LogicInTemplateRule');
const StyleAttributeRule = require('../../app/rules/StyleAttributeRule');
const IsprintTagRule = require('../../app/rules/IsprintTagRule');

const specTempDir = Constants.specTempDir;
const outputFilePath = Constants.specOutputFilePath;
const compiledOutputFilePath = Constants.specCompiledOutputFilePath;
const fileName = path.join(Constants.fileParserSpecDir, 'sample_file.isml');

describe('FileParser', () => {

    beforeEach(() => {
        FileParser.cleanOutput();
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('correctly parses a given ISML file', () => {
        FileParser.parse(fileName);

        expect(FileParser.getOutput()).not.toEqual({});
    });

    it('cleans output', () => {
        FileParser.cleanOutput();

        expect(FileParser.getOutput()).toEqual({});
    });

    it('saves output to file', () => {
        FileParser.parse(fileName);
        FileParser.saveToFile(specTempDir);

        const outputFile = require(path.join(outputFilePath));
        const expectedResult = expectedResultObj(FileParser.ENTRY_TYPES.ERROR);

        expect(outputFile).toEqual(expectedResult);
    });

    it('ignores disabled rules', () => {
        FileParser.parse(fileName);
        FileParser.saveToFile(specTempDir);
        const outputFile = require(path.join(outputFilePath));
        let ruleWasChecked = false;

        Object.keys(outputFile.errors).forEach( rule => {
            if (rule === LogicInTemplateRule.description) {
                ruleWasChecked = true;
            }
        });

        expect(ruleWasChecked).toBe(false);
    });

    it('checks non-disabled rules', () => {
        FileParser.parse(fileName);
        FileParser.saveToFile(specTempDir);
        const outputFile = require(path.join(outputFilePath));
        let ruleWasChecked = false;

        Object.keys(outputFile.errors).forEach( rule => {
            if (rule === StyleAttributeRule.description) {
                ruleWasChecked = true;
            }
        });

        expect(ruleWasChecked).toBe(true);
    });

    it('saves linter compiled output to file', () => {
        FileParser.parse(fileName);
        FileParser.compileOutput(specTempDir);

        const compiledOutputFile = require(path.join(compiledOutputFilePath));
        const expectedResult = expectedCompiledOutputObj(FileParser.ENTRY_TYPES.ERROR);

        expect(compiledOutputFile).toEqual(expectedResult);
    });

    it('sets the total quantity of errors to the compiled output', () => {
        FileParser.parse(fileName);
        FileParser.compileOutput(specTempDir);

        const compiledOutputFile = require(path.join(compiledOutputFilePath)).total;

        expect(compiledOutputFile).toEqual(2);
    });

    it('displays the correct line in output file', () => {
        FileParser.parse(fileName);
        FileParser.saveToFile(specTempDir);

        const outputFile = require(outputFilePath);

        expect(outputFile).toEqual(expectedResultObj(FileParser.ENTRY_TYPES.ERROR));
    });
});

const expectedCompiledOutputObj = type => {
    const inlineStyleRuleDesc = StyleAttributeRule.description;
    const isprintRuleDesc = IsprintTagRule.description;

    const result = {};
    result[type] = {};

    result[type][inlineStyleRuleDesc] = 1;
    result[type][isprintRuleDesc] = 1;
    result['total'] = 2;

    return result;
};

const expectedResultObj = type => {
    const result = {};
    result[type] = {};

    const inlineStyleRuleDesc = StyleAttributeRule.description;
    const isprintRuleDesc = IsprintTagRule.description;

    const filePath = path.join(...'/file_parser/sample_file.isml'.split( '/' ));
    const line = 'Line 3: <div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>';

    result[type][isprintRuleDesc] = {};
    result[type][isprintRuleDesc][filePath] = [];
    result[type][isprintRuleDesc][filePath].push(line);

    result[type][inlineStyleRuleDesc] = {};
    result[type][inlineStyleRuleDesc][filePath] = [];
    result[type][inlineStyleRuleDesc][filePath].push(line);

    return result;
};
