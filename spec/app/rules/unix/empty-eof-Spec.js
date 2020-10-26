const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../../SpecHelper');

const rule = SpecHelper.getTreeRule(specFileName);

describe('On Unix, ' + rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach(false);
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('allows an empty last line', () => {
        const occurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 0);

        expect(occurrence.length).toEqual(0);
    });

    it('detects a non-empty-last line', () => {
        const occurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 1)[0];

        expect(occurrence.line      ).toEqual('I\'m a hardcoded-text');
        expect(occurrence.lineNumber).toEqual(4);
        expect(occurrence.globalPos ).toEqual(18);
        expect(occurrence.length    ).toEqual(1);
        expect(occurrence.rule      ).toEqual(rule.id);
        expect(occurrence.message   ).toEqual(rule.description);
    });

    it('detects a last line with blank spaces', () => {
        const occurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 2)[0];

        expect(occurrence.line      ).toEqual('   ');
        expect(occurrence.lineNumber).toEqual(3);
        expect(occurrence.globalPos ).toEqual(18);
        expect(occurrence.length    ).toEqual(1);
        expect(occurrence.rule      ).toEqual(rule.id);
        expect(occurrence.message   ).toEqual(rule.description);
    });

    it('raises no error if last element is a <isif> element', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 3);

        expect(result.length).toEqual(0);
    });

    it('detects issue for a last <isif> element', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 4);

        expect(result.length).toEqual(1);
    });
});
