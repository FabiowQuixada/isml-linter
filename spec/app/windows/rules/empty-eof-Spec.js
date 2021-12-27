const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../../SpecHelper');

const rule            = SpecHelper.getTreeRule(specFileName);
const isCrlfLineBreak = true;

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('allows an empty last line', () => {
        const occurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 0, isCrlfLineBreak);

        expect(occurrence.length).toEqual(0);
    });

    it('detects a non-empty-last line', () => {
        const occurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 1, isCrlfLineBreak)[0];

        expect(occurrence.line        ).toEqual('I\'m a hardcoded-text');
        expect(occurrence.lineNumber  ).toEqual(4);
        expect(occurrence.columnNumber).toEqual(1);
        expect(occurrence.globalPos   ).toEqual(21);
        expect(occurrence.length      ).toEqual(20);
        expect(occurrence.rule        ).toEqual(rule.id);
        expect(occurrence.message     ).toEqual(rule.description);
    });

    it('detects a last line with blank spaces', () => {
        const occurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 2, isCrlfLineBreak)[0];

        expect(occurrence.line        ).toEqual('   ');
        expect(occurrence.lineNumber  ).toEqual(3);
        expect(occurrence.columnNumber).toEqual(1);
        expect(occurrence.globalPos   ).toEqual(17);
        expect(occurrence.length      ).toEqual(3);
        expect(occurrence.rule        ).toEqual(rule.id);
        expect(occurrence.message     ).toEqual(rule.description);
    });

    it('raises no error if last element is a <isif> element', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 3, isCrlfLineBreak);

        expect(result.length).toEqual(0);
    });

    it('detects issue for a last <isif> element', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 4, isCrlfLineBreak);

        expect(result.length).toEqual(1);
    });

    it('detects issue for a last <isif> element II', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 5);

        expect(result[0].lineNumber).toEqual(2);
    });
});
