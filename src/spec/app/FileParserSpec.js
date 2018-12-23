const path = require('path');
const fs = require('fs');
const FileParser = require('../../app/FileParser');
const SpecHelper = require('../SpecHelper');
const Constants = require('../../app/Constants');
const NoIsscriptRule = require('../../app/rules/no-isscript');
const NoInlineStyleRule = require('../../app/rules/no-inline-style');

const filePath = path.join(Constants.fileParserSpecDir, 'template_0.isml');
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
            if (rule === NoIsscriptRule.description) {
                ruleWasChecked = true;
            }
        });

        expect(ruleWasChecked).toBe(false);
    });

    it('checks non-disabled rules', () => {
        const result = FileParser.parse(fileContent);
        let ruleWasChecked = false;

        Object.keys(result.errors).forEach( rule => {
            if (rule === NoInlineStyleRule.description) {
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

    const EnforceIsprintRule = require('../../app/rules/enforce-isprint');
    const NoInlineStyleRule = require('../../app/rules/no-inline-style');

    const inlineStyleRuleDesc = NoInlineStyleRule.description;
    const isprintRuleDesc = EnforceIsprintRule.description;

    const line = '<div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>';

    const isprintOccurrence = {
        line,
        lineNumber: 3,
        columnStart: 136,
        length: 15
    };

    const styleOccurrence = {
        line,
        lineNumber: 3,
        columnStart: 113,
        length: 5
    };

    result[type][isprintRuleDesc] = [];
    result[type][isprintRuleDesc].push(isprintOccurrence);

    result[type][inlineStyleRuleDesc] = [];
    result[type][inlineStyleRuleDesc].push(styleOccurrence);

    return result;
};
