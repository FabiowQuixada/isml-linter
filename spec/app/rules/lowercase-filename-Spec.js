const fs           = require('fs');
const specFileName = require('path').basename(__filename);
const snake        = require('to-snake-case');
const SpecHelper   = require('../../SpecHelper');
const Constants    = require('../../../src/app/Constants');

const rule = SpecHelper.getRule(specFileName);

describe(rule.name, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('allows lower-case file names', () => {
        const fileName    = 'template_0';
        const fileContent = getRuleSpecTemplateContent(rule, fileName);
        const result      = rule.check(fileName, fileContent);

        expect(result.occurrences.length).toEqual(0);
    });

    it('detects non-lower-case file names', () => {
        const fileName    = 'Template_1';
        const fileContent = getRuleSpecTemplateContent(rule, fileName);
        const result      = rule.check(fileName, fileContent);

        expect(result.occurrences.length).not.toEqual(0);
    });
});

const getRuleSpecTemplateContent = (rule, fileName) => {
    const filePath = `${Constants.specRuleTemplateDir}/line_by_line/${snake(rule.name)}/${fileName}.isml`;
    return fs.readFileSync(filePath, 'utf-8');
};
