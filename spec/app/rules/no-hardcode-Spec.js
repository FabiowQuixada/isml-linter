const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../SpecHelper');

const rule = SpecHelper.getTreeRule(specFileName);

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects hardcoded texts', () => {
        const result      = SpecHelper.parseAndApplyRuleToTemplate(rule, 0);
        const occurrence1 = result[0];
        const occurrence2 = result[1];

        expect(occurrence1.line      ).toEqual('I\'m a hardcoded-text');
        expect(occurrence1.lineNumber).toEqual(4);
        expect(occurrence1.globalPos ).toEqual(93);
        expect(occurrence1.length    ).toEqual(20);
        expect(occurrence1.rule      ).toEqual(rule.id);
        expect(occurrence1.message   ).toEqual(rule.description);

        expect(occurrence2.line      ).toEqual('I\'m another hardcoded-text');
        expect(occurrence2.lineNumber).toEqual(7);
        expect(occurrence2.globalPos ).toEqual(168);
        expect(occurrence2.length    ).toEqual(26);
        expect(occurrence2.rule      ).toEqual(rule.id);
        expect(occurrence2.message   ).toEqual(rule.description);
    });

    it('ignores multiclause nodes', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1);

        expect(result.length).toEqual(0);
    });

    it('ignores isscript node content', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 2);

        expect(result.length).toEqual(0);
    });

    it('detects a 1-length-long hardcoded text', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 3)[0];

        expect(result.globalPos ).toEqual(33);
        expect(result.length    ).toEqual(1);
        expect(result.line      ).toEqual('g');
        expect(result.lineNumber).toEqual(6);
        expect(result.message   ).toEqual('Hardcoded string is not allowed');
        expect(result.rule      ).toEqual('no-hardcode');
    });

    it('detects lonely hardcoded text', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 4)[0];

        expect(result.globalPos ).toEqual(9);
        expect(result.length    ).toEqual(4);
        expect(result.line      ).toEqual('test');
        expect(result.lineNumber).toEqual(3);
        expect(result.message   ).toEqual('Hardcoded string is not allowed');
        expect(result.rule      ).toEqual('no-hardcode');
    });

    it('does not apply to <script> tag content', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 5);

        expect(result.length).toEqual(0);
    });

    it('does not apply to <style> tag content', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 6);

        expect(result.length).toEqual(0);
    });

    it('does not apply to <style> tag content with ISML tags within it', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 7);

        expect(result.length).toEqual(0);
    });

    it('does not apply to <style [some attribute]> tag content', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 8);

        expect(result.length).toEqual(0);
    });
});
