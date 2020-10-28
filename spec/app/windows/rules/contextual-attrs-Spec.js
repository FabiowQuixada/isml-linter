const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../../SpecHelper');
const IsmlNode     = require('../../../../src/isml_tree/IsmlNode');

const rule = SpecHelper.getTreeRule(specFileName);

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('enforces contextual attributes for "isslot" tag', () => {
        const node = new IsmlNode('<isslot context="category" />');

        expect(rule.isBroken(node)).toBeTruthy();
    });

    it('accepts contextual attributes for "isslot" tag', () => {
        const node = new IsmlNode('<isslot context="folder" context-object="someCategory" />');

        expect(rule.isBroken(node)).toBeFalsy();
    });

    it('allows attributes when not strictly required for "isslot" tag', () => {
        const node = new IsmlNode('<isslot context="global" context-object="someCategory" />');

        expect(rule.isBroken(node)).toBeFalsy();
    });

    it('detects a tag without any of the mutually exclusive required attributes', () => {
        const node = new IsmlNode('<isinclude />');

        expect(rule.isBroken(node)).toBeTruthy();
    });

    it('gets error message for tag without any of the mutually exclusive attributes', () => {
        const node = new IsmlNode('<isinclude />');

        expect(rule.isBroken(node).message).toEqual('The "isinclude" tag needs to have either "url" or "template" attribute');
    });

    it('detects a tag with one of the mutually exclusive attributes', () => {
        const node = new IsmlNode('<isinclude template="abc" />');

        expect(rule.isBroken(node)).toBeFalsy();
    });

    it('detects a tag with another of the mutually exclusive attributes', () => {
        const node = new IsmlNode('<isinclude url="def" />');

        expect(rule.isBroken(node)).toBeFalsy();
    });

    it('detects mutually exclusive attributes', () => {
        const node = new IsmlNode('<isinclude template="abc" url="def" />');

        expect(rule.isBroken(node)).toBeTruthy();
    });

    it('gets error message for mutually exclusive attributes', () => {
        const node = new IsmlNode('<isinclude template="abc" url="def" />');

        expect(rule.isBroken(node).message).toEqual('The "isinclude" tag cannot have "template" and "url" attributes simultaneously');
    });

    it('displays tag-specific message', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(result.message).toEqual('"context-object" attribute is expected when "context" attribute has value of "category"');
    });

    it('retrieves error metadata', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(result.line      ).toEqual('<isslot context="category" />');
        expect(result.lineNumber).toEqual(2);
        expect(result.globalPos ).toEqual(11);
        expect(result.length    ).toEqual(29);
        expect(result.rule      ).toEqual(rule.id);
    });

    it('correctly processes "isif" tags', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1);

        expect(result.length).toEqual(0);
    });

    it('correctly processes custom tags', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 2);

        expect(result.length).toEqual(0);
    });
});
