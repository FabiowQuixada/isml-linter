const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../SpecHelper');
const rule         = SpecHelper.getTreeRule(specFileName);

describe(rule.name, () => {
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
        expect(occurrence1.globalPos ).toEqual(90 + SpecHelper.getEolOffset(occurrence1.lineNumber));
        expect(occurrence1.length    ).toEqual(20);
        expect(occurrence1.rule      ).toEqual(rule.name);
        expect(occurrence1.message   ).toEqual(rule.description);

        expect(occurrence2.line      ).toEqual('I\'m another hardcoded-text');
        expect(occurrence2.lineNumber).toEqual(7);
        expect(occurrence2.globalPos ).toEqual(162 + SpecHelper.getEolOffset(occurrence2.lineNumber));
        expect(occurrence2.length    ).toEqual(26);
        expect(occurrence2.rule      ).toEqual(rule.name);
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

        expect(result.globalPos ).toEqual(28 + SpecHelper.getEolOffset(result.lineNumber));
        expect(result.length    ).toEqual(1);
        expect(result.line      ).toEqual('g');
        expect(result.lineNumber).toEqual(6);
        expect(result.message   ).toEqual('Hardcoded string is not allowed');
        expect(result.rule      ).toEqual('no-hardcode');
    });

    it('detects lonely hardcoded text', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 4)[0];

        expect(result.globalPos ).toEqual(7);
        expect(result.length    ).toEqual(4);
        expect(result.line      ).toEqual('test');
        expect(result.lineNumber).toEqual(3);
        expect(result.message   ).toEqual('Hardcoded string is not allowed');
        expect(result.rule      ).toEqual('no-hardcode');
    });
});
