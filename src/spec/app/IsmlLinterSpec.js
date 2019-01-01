const path                 = require('path');
const IsmlLinter           = require('../../app/IsmlLinter');
const SpecHelper           = require('../SpecHelper');
const Constants            = require('../../app/Constants');
const NoSpaceOnlyLinesRule = require('../../app/rules/no-space-only-lines');
const NoInlineStyleRule    = require('../../app/rules/no-inline-style');
const EnforceIsprintRule   = require('../../app/rules/enforce-isprint');
const FileParser           = require('../../app/FileParser');

const specSpecificDirLinterTemplate  = Constants.specSpecificDirLinterTemplate;
const specIgnoreDirLinterTemplateDir = Constants.specIgnoreDirLinterTemplateDir;
const UNPARSEABLE                    = Constants.UNPARSEABLE;

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('lints ISML files in a given directory', () => {
        const result = IsmlLinter.run(specSpecificDirLinterTemplate);

        expect(result).toEqual(expectedResultObj('errors'));
    });

    it('ignores files under the node_modules/ directory', () => {
        IsmlLinter.run(specSpecificDirLinterTemplate);

        const output = JSON.stringify(IsmlLinter.getOutput());

        expect(output.indexOf('node_modules')).toBe(-1);
    });

    it('processes the correct line in result json data', () => {
        const result = IsmlLinter.run(specSpecificDirLinterTemplate);

        expect(result).toEqual(expectedResultObj(FileParser.ENTRY_TYPES.ERROR));
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

        expect(result.indexOf('spec')).toEqual(-1);
        expect(result.indexOf('isml-linter')).toEqual(-1);
    });

    it('lists invalid templates as "unparseable"', () => {
        const result = IsmlLinter.run(specSpecificDirLinterTemplate);

        expect(result[UNPARSEABLE][0]).toEqual({
            'template_0.isml': 'Invalid ISML DOM :: Unbalanced <div> element at line 2'
        });
    });
});

const expectedResultObj = type => {
    const result = {};
    result[type] = {};

    const inlineStyleRuleDesc = NoInlineStyleRule.description;
    const blankLineRuleDesc   = NoSpaceOnlyLinesRule.description;
    const isprintRuleDesc     = EnforceIsprintRule.description;

    const file0Path       = path.join(...'/template_1.isml'.split( '/' ));
    const file1Path       = path.join(...'/template_2.isml'.split( '/' ));
    const inlineStyleLine = {
        line: '<div style="display: none;">${addToCartUrl}</div>',
        lineNumber: 1,
        columnStart: 5,
        length: 5
    };
    const blankLine       = {
        line: '   ',
        lineNumber: 2,
        columnStart: 50,
        length: 4
    };
    const isprintLine0    = {
        line: '<div style="display: none;">${addToCartUrl}</div>',
        lineNumber: 1,
        columnStart: 28,
        length: 15
    };
    const isprintLine1    = {
        line: ' ${URLUtils.https(\'Reorder-ListingPage\')}',
        lineNumber: 1,
        columnStart: 1,
        length: 40
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

    result[Constants.UNPARSEABLE] = [ { 'template_0.isml' : 'Invalid ISML DOM :: Unbalanced <div> element at line 2' } ];

    return result;
};
