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

    it('detects "dw.web.Resource"', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0)[0];

        expect(result.lineNumber  ).toEqual(2);
        expect(result.columnNumber).toEqual(6);
        expect(result.globalPos   ).toEqual(12);
        expect(result.length      ).toEqual(7);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual('"dw.web." is not necessary since "Resource" is available globally');
    });

    it('detects "require("dw/web/Resource")"', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1)[0];

        expect(result.lineNumber  ).toEqual(1);
        expect(result.columnNumber).toEqual(14);
        expect(result.globalPos   ).toEqual(14);
        expect(result.length      ).toEqual(26);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual('"require("dw/web/Resource")" is not necessary since "Resource" is available globally');
    });

    it('detects "require(\'dw/web/Resource\')"', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 2)[0];

        expect(result.lineNumber  ).toEqual(1);
        expect(result.columnNumber).toEqual(14);
        expect(result.globalPos   ).toEqual(14);
        expect(result.length      ).toEqual(26);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual('"require(\'dw/web/Resource\')" is not necessary since "Resource" is available globally');
    });

    it('detects "dw.web.URLUtils"', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 3)[0];

        expect(result.lineNumber  ).toEqual(2);
        expect(result.columnNumber).toEqual(6);
        expect(result.globalPos   ).toEqual(12);
        expect(result.length      ).toEqual(7);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual('"dw.web." is not necessary since "URLUtils" is available globally');
    });

    it('detects "require("dw/web/URLUtils")"', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 4)[0];

        expect(result.lineNumber  ).toEqual(1);
        expect(result.columnNumber).toEqual(17);
        expect(result.globalPos   ).toEqual(17);
        expect(result.length      ).toEqual(26);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual('"require("dw/web/URLUtils")" is not necessary since "URLUtils" is available globally');
    });

    it('detects "require(\'dw/web/URLUtils\')"', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 5)[0];

        expect(result.lineNumber  ).toEqual(1);
        expect(result.columnNumber).toEqual(17);
        expect(result.globalPos   ).toEqual(17);
        expect(result.length      ).toEqual(26);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual('"require(\'dw/web/URLUtils\')" is not necessary since "URLUtils" is available globally');
    });

    it('detects "dw.util.StringUtils"', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 6)[0];

        expect(result.lineNumber  ).toEqual(2);
        expect(result.columnNumber).toEqual(6);
        expect(result.globalPos   ).toEqual(12);
        expect(result.length      ).toEqual(8);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual('"dw.util." is not necessary since "StringUtils" is available globally');
    });

    it('detects "require("dw/util/StringUtils")"', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 7)[0];

        expect(result.lineNumber  ).toEqual(1);
        expect(result.columnNumber).toEqual(14);
        expect(result.globalPos   ).toEqual(14);
        expect(result.length      ).toEqual(30);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual('"require("dw/util/StringUtils")" is not necessary since "StringUtils" is available globally');
    });

    it('detects "require(\'dw/util/StringUtils\')"', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 8)[0];

        expect(result.lineNumber  ).toEqual(1);
        expect(result.columnNumber).toEqual(14);
        expect(result.globalPos   ).toEqual(14);
        expect(result.length      ).toEqual(30);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual('"require(\'dw/util/StringUtils\')" is not necessary since "StringUtils" is available globally');
    });
});
