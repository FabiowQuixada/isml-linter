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
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0);

        expect(result).toEqual([{
            line        : 'I\'m a hardcoded-text',
            lineNumber  : 4,
            columnStart : 90,
            length      : 20,
            rule        : rule.name,
            message     : rule.description
        }, {
            line        : 'I\'m another hardcoded-text',
            lineNumber  : 7,
            columnStart : 162,
            length      : 26,
            rule        : rule.name,
            message     : rule.description
        }]);
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

        expect(result).toEqual({
            columnStart : 28,
            length      : 1,
            line        : 'g',
            lineNumber  : 6,
            message     : 'Hardcoded string is not allowed',
            rule        : 'no-hardcode'
        });
    });

    it('detects lonely hardcoded text', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 4);

        expect(result[0]).toEqual({
            columnStart : 7,
            length      : 4,
            line        : 'test',
            lineNumber  : 3,
            message     : 'Hardcoded string is not allowed',
            rule        : 'no-hardcode'
        });
    });
});
