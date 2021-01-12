const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../../SpecHelper');

const rule = SpecHelper.getTreeRule(specFileName);

describe('On Unix, ' + rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects simplest wrong miss-alignment case', () => {
        const result      = SpecHelper.parseAndApplyRuleToTemplate(rule, 0);
        const occurrence0 = result[0];
        const occurrence1 = result[1];

        expect(occurrence0.line      ).toEqual('<isset name="var1" value="${value1}" scope="page"/>');
        expect(occurrence0.lineNumber).toEqual(1);
        expect(occurrence0.globalPos ).toEqual(0);
        expect(occurrence0.length    ).toEqual(51);
        expect(occurrence0.rule      ).toEqual(rule.id);
        expect(occurrence0.message   ).toEqual(rule.description);

        expect(occurrence1.line      ).toEqual('<isset name="var11" value="${value11}" scope="page"/>');
        expect(occurrence1.lineNumber).toEqual(2);
        expect(occurrence1.globalPos ).toEqual(52);
        expect(occurrence1.length    ).toEqual(53);
        expect(occurrence1.rule      ).toEqual(rule.id);
        expect(occurrence1.message   ).toEqual(rule.description);

        expect(result.length ).toEqual(2);
    });

    it('allows aligned attributes', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1);

        expect(result.length).toEqual(0);
    });

    it('checks alignment only for consecutive tags', () => {
        const result     = SpecHelper.parseAndApplyRuleToTemplate(rule, 3);
        const occurrence = result[0];

        expect(occurrence.line      ).toEqual('<isset name="var11" value="${value11}" scope="page"/>');
        expect(occurrence.lineNumber).toEqual(3);
        expect(occurrence.globalPos ).toEqual(64);
        expect(occurrence.length    ).toEqual(53);
        expect(occurrence.rule      ).toEqual(rule.id);
        expect(occurrence.message   ).toEqual(rule.description);

        expect(result.length).toEqual(1);
    });
});
