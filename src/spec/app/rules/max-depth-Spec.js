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

    it('detects a too-deeply-nested template', () => {
        const occurrences = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(occurrences.line      ).toEqual('<isprint class="lvl-11" />');
        expect(occurrences.lineNumber).toEqual(11);
        expect(occurrences.globalPos ).toEqual(490);
        expect(occurrences.length    ).toEqual(26);
        expect(occurrences.rule      ).toEqual(rule.name);
        expect(occurrences.message   ).toEqual(rule.description);
    });
});
