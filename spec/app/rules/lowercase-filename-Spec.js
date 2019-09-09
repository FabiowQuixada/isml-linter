const fs           = require('fs');
const specFileName = require('path').basename(__filename);
const snake        = require('to-snake-case');
const SpecHelper   = require('../../SpecHelper');
const Constants    = require('../../../src/Constants');

const rule = SpecHelper.getRule(specFileName);

describe(rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('allows lower-case file names', () => {
        const templateName    = 'template_0';
        const templateContent = getRuleSpecTemplateContent(rule, templateName);
        const result          = rule.check(templateName, templateContent);

        expect(result.occurrences.length).toEqual(0);
    });

    it('detects non-lower-case file names', () => {
        const templateName    = 'Template_1';
        const templateContent = getRuleSpecTemplateContent(rule, templateName);
        const result          = rule.check(templateName, templateContent);

        expect(result.occurrences.length).not.toEqual(0);
    });
});

const getRuleSpecTemplateContent = (rule, templateName) => {
    const templatePath = `${Constants.specRuleTemplateDir}/line_by_line/${snake(rule.id)}/${templateName}.isml`;
    return fs.readFileSync(templatePath, 'utf-8');
};
