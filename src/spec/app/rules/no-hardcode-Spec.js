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
            length      : 34,
            rule        : rule.name,
            message     : rule.description
        }, {
            line        : 'I\'m another hardcoded-text',
            lineNumber  : 7,
            columnStart : 162,
            length      : 40,
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
});
