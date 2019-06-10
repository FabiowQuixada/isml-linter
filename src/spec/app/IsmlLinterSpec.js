const path                 = require('path');
const glob                 = require('glob');
const fs                   = require('fs');
const IsmlLinter           = require('../../app/IsmlLinter');
const SpecHelper           = require('../SpecHelper');
const Constants            = require('../../app/Constants');
const NoSpaceOnlyLinesRule = require('../../app/rules/line_by_line/no-space-only-lines');
const NoInlineStyleRule    = require('../../app/rules/line_by_line/no-inline-style');
const EnforceIsprintRule   = require('../../app/rules/line_by_line/enforce-isprint');
const ExceptionUtils       = require('../../app/util/ExceptionUtils');
const ConfigUtils          = require('../../app/util/ConfigUtils');

const specSpecificDirLinterTemplate  = Constants.specSpecificDirLinterTemplate;
const specIgnoreDirLinterTemplateDir = Constants.specIgnoreDirLinterTemplateDir;
const UNPARSEABLE                    = ExceptionUtils.types.INVALID_TEMPLATE;

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('lints ISML files in a given directory', () => {
        const result         = IsmlLinter.run(specSpecificDirLinterTemplate);
        const expectedResult = expectedResultObj('errors');

        expect(result.errors).toEqual(expectedResult.errors);
    });

    it('lints ISML files in a given array of file paths', () => {
        const filePathArray  = glob.sync('src/spec/templates/default/isml_linter/specific_directory_to_be_linted/**/*.isml');
        const result         = IsmlLinter.run(filePathArray);
        const expectedResult = expectedResultObj('errors');

        expect(result.errors).toEqual(expectedResult.errors);
    });

    it('ignores files under the node_modules/ directory', () => {
        const result       = IsmlLinter.run(specSpecificDirLinterTemplate);
        const stringResult = JSON.stringify(result);

        expect(stringResult.indexOf('node_modules')).toBe(-1);
    });

    it('processes the correct line in result json data', () => {
        const result = IsmlLinter.run(specSpecificDirLinterTemplate);

        expect(result.errors['Wrap expression in <isprint> tag']['src/spec/templates/default/isml_linter/specific_directory_to_be_linted/template_1.isml'][0].line).toEqual('<div style="display: none;">${addToCartUrl}</div>');
        expect(result.errors['Wrap expression in <isprint> tag']['src/spec/templates/default/isml_linter/specific_directory_to_be_linted/template_2.isml'][0].line).toEqual(' ${URLUtils.https(\'Reorder-ListingPage\')}');
        expect(result.errors['Avoid using inline style']['src/spec/templates/default/isml_linter/specific_directory_to_be_linted/template_1.isml'][0].line).toEqual('<div style="display: none;">${addToCartUrl}</div>');
        expect(result.errors['Line contains only blank spaces']['src/spec/templates/default/isml_linter/specific_directory_to_be_linted/template_1.isml'][0].line).toEqual('   ');
    });

    it('does not consider errors in directories defined to be ignored in the config file', () => {
        const result = JSON.stringify(IsmlLinter.run(specIgnoreDirLinterTemplateDir));

        expect(result.indexOf('this_directory_is_to_be_ignored')).toEqual(-1);
    });

    it('does not consider errors in files defined to be ignored in the config file', () => {
        const result = JSON.stringify(IsmlLinter.run(specIgnoreDirLinterTemplateDir));

        expect(result.indexOf('Email.isml')).toEqual(-1);
    });

    it('considers errors in files not defined to be ignored in the config file', () => {
        const result = JSON.stringify(IsmlLinter.run(specIgnoreDirLinterTemplateDir));

        expect(result.indexOf('this_directory_should_be_tested')).not.toEqual(-1);
    });

    it('parses files only under a given directory', () => {
        const result = JSON.stringify(IsmlLinter.run(specIgnoreDirLinterTemplateDir));

        expect(result.indexOf('this_directory_is_to_be_ignored')).toEqual(-1);
    });

    it('lists invalid templates as "unparseable"', () => {
        const result          = IsmlLinter.run(specSpecificDirLinterTemplate);
        const expectedMessage = ExceptionUtils.unbalancedElementError('div', 2).message;
        const actualResult    = result[UNPARSEABLE][0];
        const filePath        = path.join(specSpecificDirLinterTemplate, 'template_0.isml');

        expect(actualResult.filePath  ).toEqual(filePath);
        expect(actualResult.message   ).toEqual(expectedMessage);
        expect(actualResult.lineNumber).toEqual(2);
    });

    it('accepts template absolute path as parameter', () => {
        const absoluteFilePath = path.join(Constants.clientAppDir, specSpecificDirLinterTemplate, 'template_0.isml');
        const result           = IsmlLinter.run(absoluteFilePath);
        const expectedMessage  = ExceptionUtils.unbalancedElementError('div', 2).message;
        const actualResult     = result[UNPARSEABLE][0];

        expect(actualResult.filePath  ).toEqual(absoluteFilePath);
        expect(actualResult.message   ).toEqual(expectedMessage);
        expect(actualResult.lineNumber).toEqual(2);
    });

    it('applies fixes for tree-based rules', () => {
        ConfigUtils.load({
            autoFix: true,
            rules: {
                'one-element-per-line': {}
            }
        });

        const filePath        = path.join(Constants.clientAppDir, specSpecificDirLinterTemplate, 'template_1.isml');
        const originalContent = fs.readFileSync(filePath, 'utf-8');
        const result          = IsmlLinter.run(filePath);

        expect(result.templatesFixed).toEqual(1);
        fs.writeFileSync(filePath, originalContent);
    });
});

const expectedResultObj = type => {
    const result = {};
    result[type] = {};

    const inlineStyleRuleDesc = NoInlineStyleRule.description;
    const blankLineRuleDesc   = NoSpaceOnlyLinesRule.description;
    const isprintRuleDesc     = EnforceIsprintRule.description;
    const expectedMessage     = ExceptionUtils.unbalancedElementError('div', 2).message;
    const filePath            = path.join(specSpecificDirLinterTemplate, 'template_0.isml');

    const file0Path       = path.join(specSpecificDirLinterTemplate, 'template_1.isml');
    const file1Path       = path.join(specSpecificDirLinterTemplate, 'template_2.isml');
    const inlineStyleLine = {
        line        : '<div style="display: none;">${addToCartUrl}</div>',
        lineNumber  : 1,
        globalPos : 5,
        length      : 5,
        rule        : NoInlineStyleRule.name,
        message     : NoInlineStyleRule.description
    };
    const blankLine       = {
        line        : '   ',
        lineNumber  : 2,
        globalPos : 50,
        length      : 4,
        rule        : NoSpaceOnlyLinesRule.name,
        message     : NoSpaceOnlyLinesRule.description
    };
    const isprintLine0    = {
        line        : '<div style="display: none;">${addToCartUrl}</div>',
        lineNumber  : 1,
        globalPos : 28,
        length      : 15,
        rule        : EnforceIsprintRule.name,
        message     : EnforceIsprintRule.description
    };
    const isprintLine1    = {
        line        : ' ${URLUtils.https(\'Reorder-ListingPage\')}',
        lineNumber  : 1,
        globalPos : 1,
        length      : 40,
        rule        : EnforceIsprintRule.name,
        message     : EnforceIsprintRule.description
    };

    result[type][isprintRuleDesc]            = {};
    result[type][isprintRuleDesc][file0Path] = [];
    result[type][isprintRuleDesc][file0Path].push(isprintLine0);
    result[type][isprintRuleDesc][file1Path] = [];
    result[type][isprintRuleDesc][file1Path].push(isprintLine1);

    result[type][inlineStyleRuleDesc]            = {};
    result[type][inlineStyleRuleDesc][file0Path] = [];
    result[type][inlineStyleRuleDesc][file0Path].push(inlineStyleLine);

    result[type][blankLineRuleDesc]            = {};
    result[type][blankLineRuleDesc][file0Path] = [];
    result[type][blankLineRuleDesc][file0Path].push(blankLine);

    result[UNPARSEABLE] = [{
        filePath   : filePath,
        message    : expectedMessage,
        lineNumber : 2
    }];

    result.issueQty = 5;

    return result;
};
