const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../../SpecHelper');
const ConfigUtils  = require('../../../../src/util/ConfigUtils');

const rule = SpecHelper.getRule(specFileName);

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('allows short templates', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 0);
        const result          = rule.check(templateContent);

        expect(result.occurrences).toEqual([]);
    });

    it('allows on-the-limit templates', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 1);
        const result          = rule.check(templateContent);

        expect(result.occurrences).toEqual([]);
    });

    it('detects over the edge templates', () => {
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 2);
        const occurrence      = rule.check(templateContent).occurrences[0];

        expect(occurrence.line      ).toEqual('first line');
        expect(occurrence.lineNumber).toEqual(1);
        expect(occurrence.globalPos ).toEqual(0);
        expect(occurrence.length    ).toEqual(0);
        expect(occurrence.rule      ).toEqual(rule.id);
        expect(occurrence.message   ).toEqual(rule.description);
    });

    it('allows short templates with custom max configuration', () => {
        ConfigUtils.load({ rules : { 'max-lines': { max: 7 } } });
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 3);
        const result          = rule.check(templateContent);

        expect(result.occurrences).toEqual([]);
    });

    it('allows on-the-limit templates with custom max configuration', () => {
        ConfigUtils.load({ rules : { 'max-lines': { max: 7 } } });
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 4);
        const result          = rule.check(templateContent);

        expect(result.occurrences).toEqual([]);
    });

    it('detects over the edge templates with custom max configuration', () => {
        ConfigUtils.load({ rules : { 'max-lines': { max: 7 } } });
        const templateContent = SpecHelper.getRuleSpecTemplateContent(rule, 5);
        const occurrence      = rule.check(templateContent).occurrences[0];

        expect(occurrence.line      ).toEqual('first line');
        expect(occurrence.lineNumber).toEqual(1);
        expect(occurrence.globalPos ).toEqual(0);
        expect(occurrence.length    ).toEqual(0);
        expect(occurrence.rule      ).toEqual(rule.id);
        expect(occurrence.message   ).toEqual(rule.description);
    });

});
