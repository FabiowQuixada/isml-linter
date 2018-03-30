const appRoot = require('app-root-path');
const reqlib = appRoot.require;
const path = require('path');
const FileParser = reqlib('/src/app/FileParser');
const SpecHelper = reqlib('/src/spec/SpecHelper');
const Constants = reqlib('/src/app/Constants');
const LogicInTemplateRule = reqlib('/src/app/rules/LogicInTemplateRule');
const StyleAttributeRule = reqlib('/src/app/rules/StyleAttributeRule');

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

        const outputFile = require('/' + outputFilePath);
        const expectedResult = expectedResultObj('errors');

        expect(outputFile).toEqual(expectedResult);
    });

    it('ignores disabled rules', () => {
        FileParser.parse(fileName);
        FileParser.saveToFile(specTempDir);
        const outputFile = require('/' + outputFilePath);
        let ruleWasChecked = false;

        Object.keys(outputFile.errors).forEach( rule => {
            if (rule === LogicInTemplateRule.title) {
                ruleWasChecked = true;
            }
        });

        expect(ruleWasChecked).toBe(false);
    });

    it('checks non-disabled rules', () => {
        FileParser.parse(fileName);
        FileParser.saveToFile(specTempDir);
        const outputFile = require('/' + outputFilePath);
        let ruleWasChecked = false;

        Object.keys(outputFile.errors).forEach( rule => {
            if (rule === StyleAttributeRule.title) {
                ruleWasChecked = true;
            }
        });

        expect(ruleWasChecked).toBe(true);
    });

    it('saves linter compiled output to file', () => {
        FileParser.parse(fileName);
        FileParser.compileOutput(specTempDir);

        const compiledOutputFile = require('/' + compiledOutputFilePath);
        const expectedResult = expectedCompiledOutputObj();

        expect(compiledOutputFile).toEqual(expectedResult);
    });

    it('sets the total quantity of errors to the compiled output', () => {
        FileParser.parse(fileName);
        FileParser.compileOutput(specTempDir);

        const compiledOutputFile = require('/' + compiledOutputFilePath).total;

        expect(compiledOutputFile).toEqual(2);
    });

    it('displays the correct line in output file', () => {
        FileParser.parse(fileName);
        FileParser.saveToFile(specTempDir);

        const outputFile = require(outputFilePath);

        expect(outputFile).toEqual(expectedOne());
    });

    const expectedOne = () => ({
        'errors' : {
            'Avoid using inline style' : {
                '/file_parser/sample_file.isml' : [
                    'Line 3: <div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>'
                ]
            },
            'Wrap expression in <isprint> tag' : {
                '/file_parser/sample_file.isml' : [
                    'Line 3: <div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>' ]
            }
        }
    });

    const expectedCompiledOutputObj = () => ({
        errors : {
            'Avoid using inline style' : 1,
            'Wrap expression in <isprint> tag' : 1 },
        'total' : 2
    });

    const expectedResultObj = type => {
        let result = {};

        result[type] = {
            'Avoid using inline style' : {
                '/file_parser/sample_file.isml' : [
                    'Line 3: <div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>' ]
            },
            'Wrap expression in <isprint> tag' : {
                '/file_parser/sample_file.isml' : [
                    'Line 3: <div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>' ]
            }
        };

        return result;
    };
});
