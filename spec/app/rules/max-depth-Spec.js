const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../SpecHelper');
const rule         = SpecHelper.getTreeRule(specFileName);

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects a too-deeply-nested template', () => {
        const occurrence = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(occurrence.line      ).toEqual('<isprint class="lvl-11" />');
        expect(occurrence.lineNumber).toEqual(11);
        expect(occurrence.globalPos ).toEqual(500);
        expect(occurrence.length    ).toEqual(26);
        expect(occurrence.rule      ).toEqual(rule.id);
        expect(occurrence.message   ).toEqual(rule.description);
    });

    it('detects a too-deeply-nested template as a warning-level occurrence', () => {
        const occurrences = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(occurrences.level).toEqual('warning');
    });
});
