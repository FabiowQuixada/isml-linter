const fs          = require('fs');
const SpecHelper  = require('../../SpecHelper');
const TreeBuilder = require('../../../src/app/isml_tree/TreeBuilder');
const Constants   = require('../../../src/app/Constants');

describe('Tree auto-fix', () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('prints tree as-is', () => {
        compareResultForTemplate(0);
    });

    it('prints complex tree as-is', () => {
        compareResultForTemplate(1);
    });

    it('prints simple tree as-is', () => {
        compareResultForTemplate(2);
    });

    it('prints simple tree with no eof line as-is', () => {
        compareResultForTemplate(3);
    });

    it('prints simple tree with "iselse" as-is', () => {
        compareResultForTemplate(4);
    });
});

const compareResultForTemplate = number => {
    const templatePath            = getFilePath(number);
    const originalTemplateContent = fs.readFileSync(templatePath, 'utf-8');
    const rootNode                = TreeBuilder.build(templatePath).rootNode;
    const actualContent           = rootNode.toString();

    expect(actualContent).toEqual(originalTemplateContent);
};

const getFilePath = number => {
    return `${Constants.specAutofixTemplatesDir}/template_${number}.isml`;
};
