const path = require('path');
const fs = require('fs');
const FileParser = require('../../app/FileParser');
const SpecHelper = require('../SpecHelper');
const Constants = require('../../app/Constants');
const LogicInTemplateRule = require('../../app/rules/LogicInTemplateRule');
const StyleAttributeRule = require('../../app/rules/StyleAttributeRule');

const filePath = path.join(Constants.fileParserSpecDir, 'sample_file.isml');
const fileContent = fs.readFileSync(filePath, 'utf-8');
const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('correctly parses a given ISML file', () => {
        const result = FileParser.parse(fileContent);

        expect(result).not.toEqual({});
    });

    it('ignores disabled rules', () => {
        const result = FileParser.parse(fileContent);
        let ruleWasChecked = false;

        Object.keys(result.errors).forEach( rule => {
            if (rule === LogicInTemplateRule.description) {
                ruleWasChecked = true;
            }
        });

        expect(ruleWasChecked).toBe(false);
    });

    it('checks non-disabled rules', () => {
        const result = FileParser.parse(fileContent);
        let ruleWasChecked = false;

        Object.keys(result.errors).forEach( rule => {
            if (rule === StyleAttributeRule.description) {
                ruleWasChecked = true;
            }
        });

        expect(ruleWasChecked).toBe(true);
    });

    it('results in a json file', () => {
        const actualResult = FileParser.parse(fileContent);
        const expectedResult = expectedResultObj(FileParser.ENTRY_TYPES.ERROR);

        expect(actualResult).toEqual(expectedResult);
    });
});

const expectedResultObj = type => {
    const result = {};
    result[type] = {};

    const IsprintTagRule = require('../../app/rules/IsprintTagRule');
    const StyleAttributeRule = require('../../app/rules/StyleAttributeRule');

    const inlineStyleRuleDesc = StyleAttributeRule.description;
    const isprintRuleDesc = IsprintTagRule.description;

    const line = '<div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>';

    const isprintOccurrence = {
        line,
        lineNumber: 2,
        columnStart: 136,
        length: 15
    };

    const styleOccurrence = {
        line,
        lineNumber: 2,
        columnStart: 113,
        length: 5
    };

    result[type][isprintRuleDesc] = [];
    result[type][isprintRuleDesc].push(isprintOccurrence);

    result[type][inlineStyleRuleDesc] = [];
    result[type][inlineStyleRuleDesc].push(styleOccurrence);

    return result;
};
