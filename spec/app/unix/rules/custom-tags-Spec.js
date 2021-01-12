const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../../SpecHelper');
const ConfigUtils  = require('../../../../src/util/ConfigUtils');

const rule = SpecHelper.getTreeRule(specFileName);

describe('On Unix, ' + rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('identifies if custom modules is included and used', () => {
        ConfigUtils.load({ rules: {'custom-attributes': {}}});
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0);

        expect(result).toEqual([]);
    });

    it('identifies if custom modules is not included, but a custom tag is used', () => {
        ConfigUtils.load({ rules: {'custom-attributes': {}}});
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1)[0];

        expect(result.line      ).toEqual('<isinclude template="util/modules" />');
        expect(result.lineNumber).toEqual(1);
        expect(result.globalPos ).toEqual(0);
        expect(result.length    ).toEqual(37);
        expect(result.rule      ).toEqual(rule.id);
        expect(result.message   ).toEqual('Unnecessary inclusion of the modules template');
    });

    it('identifies if custom modules is included, but no custom tag is used', () => {
        ConfigUtils.load({ rules: {'custom-attributes': {}}});
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 2)[0];

        expect(result.line      ).toEqual('<ismoduleone p_product="${productLineItem.product}" />');
        expect(result.lineNumber).toEqual(4);
        expect(result.globalPos ).toEqual(119);
        expect(result.length    ).toEqual(54);
        expect(result.rule      ).toEqual(rule.id);
        expect(result.message   ).toEqual('Custom tag "ismoduleone" could not be identified. Maybe you forgot to include the modules template?');
    });


    it('identifies if custom modules is nor included, nor used', () => {
        ConfigUtils.load({ rules: {'custom-attributes': {}}});
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 3);

        expect(result).toEqual([]);
    });

    it('identifies if custom modules is included, but no custom tag is declared in util/modules', () => {
        ConfigUtils.load({ rules: {'custom-attributes': {}}});
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 4)[0];

        expect(result.line      ).toEqual('<isproductprice p_product="${productLineItem.product}" />');
        expect(result.lineNumber).toEqual(4);
        expect(result.globalPos ).toEqual(119);
        expect(result.length    ).toEqual(57);
        expect(result.rule      ).toEqual(rule.id);
        expect(result.message   ).toEqual('Unknown tag "isproductprice". Maybe you forgot to add it to util/modules template?');
    });

    it('allows only lowercase custom module attributes', () => {
        ConfigUtils.load({ rules: { 'custom-tags': {} } });
        const IsmlLinter = require('../../../../src/IsmlLinter');

        const result     = IsmlLinter.run('./cartridges');
        const occurrence = result.errors[rule.id]['modules.isml'][0];

        expect(occurrence.line      ).toEqual('');
        expect(occurrence.lineNumber).toEqual(1);
        expect(occurrence.globalPos ).toEqual(0);
        expect(occurrence.length    ).toEqual(10);
        expect(occurrence.rule      ).toEqual(rule.id);
        expect(occurrence.message   ).toEqual('Module properties need to be lower case: "ismodulethree" module has the invalid "uppercaseAttribute" attribute');
    });

    it('sets occurrence level properly', () => {
        ConfigUtils.load({ rules: { 'custom-tags': {
            level : 'info'
        } } });
        const IsmlLinter = require('../../../../src/IsmlLinter');

        const result     = IsmlLinter.run('./cartridges');
        const occurrence = result.info[rule.id]['modules.isml'][0];

        expect(occurrence.level).toEqual('info');
    });
});
