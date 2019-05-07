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
        const occurrences = SpecHelper.parseAndApplyRuleToTemplate(rule, 0);

        expect(occurrences).toEqual([{
            line        : '<isprint class="lvl-11" />',
            lineNumber  : 11,
            columnStart : 490,
            length      : 26,
            rule        : rule.name,
            message     : rule.description
        }]);
    });
});
