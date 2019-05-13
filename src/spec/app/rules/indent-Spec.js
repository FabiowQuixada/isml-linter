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

    it('detects simplest wrong indentation case', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0);

        expect(result).toEqual([{
            line        : '<br/>',
            lineNumber  : 2,
            columnStart : 6,
            length      : 3,
            rule        : rule.name,
            message     : rule.description
        }]);
    });

    it('detects wrong indentation with previous empty line', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 1);

        expect(result).toEqual([{
            line        : '<br/>',
            lineNumber  : 3,
            columnStart : 7,
            length      : 3,
            rule        : rule.name,
            message     : rule.description
        }]);
    });

    it('ignores indentation for elements in the same line as their parents', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 2);

        expect(result).toEqual([]);
    });

    it('detects wrong indentation with previous sibling element', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 3);

        expect(result).toEqual([{
            line        : '<input type="text" />',
            lineNumber  : 3,
            columnStart : 87,
            length      : 5,
            rule        : rule.name,
            message     : rule.description
        }]);
    });

    it('checks indendation for elements at depth 0', () => {
        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 5);

        expect(result).toEqual([]);
    });
});
