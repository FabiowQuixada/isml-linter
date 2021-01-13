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

    it('detects a too-deeply-nested template', () => {
        const occurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 0, isCrlfLineBreak)[0];

        expect(occurrence.line      ).toEqual('<isprint class="lvl-11" />');
        expect(occurrence.lineNumber).toEqual(11);
        expect(occurrence.globalPos ).toEqual(500);
        expect(occurrence.length    ).toEqual(26);
        expect(occurrence.rule      ).toEqual(rule.id);
        expect(occurrence.message   ).toEqual(rule.description);
    });

    it('detects a too-deeply-nested template as a warning-level occurrence', () => {
        const occurrenceList = SpecHelper.parseAndApplyRuleToTemplate(rule, 0, isCrlfLineBreak)[0];

        expect(occurrenceList.level).toEqual('warning');
    });

    it('detects the whole element body, including suffix and inner content', () => {
        const result     = SpecHelper.parseAndApplyRuleToTemplate(rule, 1, isCrlfLineBreak);
        const occurrence = result[0];

        expect(occurrence.length).toEqual(339);
    });
});
