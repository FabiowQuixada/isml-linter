const path = require('path');
const FileParser = require('../../app/FileParser');
const SpecHelper = require('../SpecHelper');
const Constants = require('../../app/Constants');
const LogicInTemplateRule = require('../../app/rules/LogicInTemplateRule');
const StyleAttributeRule = require('../../app/rules/StyleAttributeRule');

const fileName = path.join(Constants.fileParserSpecDir, 'sample_file.isml');
const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('correctly parses a given ISML file', () => {
        const result = FileParser.parse(fileName);

        expect(result).not.toEqual({});
    });

    it('ignores disabled rules', () => {
        const result = FileParser.parse(fileName);
        let ruleWasChecked = false;

        Object.keys(result.errors).forEach( rule => {
            if (rule === LogicInTemplateRule.description) {
                ruleWasChecked = true;
            }
        });

        expect(ruleWasChecked).toBe(false);
    });

    it('checks non-disabled rules', () => {
        const result = FileParser.parse(fileName);
        let ruleWasChecked = false;

        Object.keys(result.errors).forEach( rule => {
            if (rule === StyleAttributeRule.description) {
                ruleWasChecked = true;
            }
        });

        expect(ruleWasChecked).toBe(true);
    });

    it('results in a json file', () => {
        const actualResult = FileParser.parse(fileName);
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

    const line = 'Line 3: <div class="addToCartUrl" style="display: none;">${addToCartUrl}</div>';

    result[type][isprintRuleDesc] = [];
    result[type][isprintRuleDesc].push(line);

    result[type][inlineStyleRuleDesc] = [];
    result[type][inlineStyleRuleDesc].push(line);

    return result;
};
