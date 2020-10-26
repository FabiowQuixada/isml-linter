const SpecHelper   = require('../../SpecHelper');
const specFileName = require('path').basename(__filename);
const IsmlNode     = require('../../../src/isml_tree/IsmlNode');

const rule = SpecHelper.getTreeRule(specFileName);

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects a deprecated value', () => {
        const node = new IsmlNode('<iscache status="off" />');

        expect(rule.isBroken(node)).toBeTruthy();
    });

    it('allows non-deprecated values', () => {
        const node = new IsmlNode('<iscache status="on" />');

        expect(rule.isBroken(node)).toBeFalsy();
    });

    it('allows attribute-less tags', () => {
        const node = new IsmlNode('<iscache/>');

        expect(rule.isBroken(node)).toBeFalsy();
    });

    it('displays tag-specific message', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(result.message).toEqual('"off" value is deprecated for "status" attribute');
    });

    it('retrieves error metadata', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(result.line      ).toEqual('<iscache status="off" />');
        expect(result.lineNumber).toEqual(2);
        expect(result.globalPos ).toEqual(20);
        expect(result.length    ).toEqual(12);
        expect(result.rule      ).toEqual(rule.id);
    });

    it('ignores custom tags', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1);

        expect(result.length).toEqual(0);
    });
});
