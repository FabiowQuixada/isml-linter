const fs           = require('fs');
const SpecHelper   = require('../../SpecHelper');
const TreeBuilder  = require('../../../src/isml_tree/TreeBuilder');
const Constants    = require('../../../src/Constants');
const GeneralUtils = require('../../../src/util/GeneralUtils');

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

    it('does not duplicate masked isml expression', () => {
        compareResultForTemplate(5);
    });

    it('does not mask an isml expression', () => {
        compareResultForTemplate(6);
    });

    it('does not erase <isif> tag hardcode-started content', () => {
        compareResultForTemplate(7);
    });

    it('does not duplicate hardcode-ended content', () => {
        compareResultForTemplate(8);
    });

    it('does not remove content if deprecated isml comment is present', () => {
        compareResultForTemplate(9);
    });

    it('indents closing tags properly if deprecated isml comment is present', () => {
        compareResultForTemplate(10);
    });

    it('handles ">" character within <iselseif> tag expression', () => {
        compareResultForTemplate(11);
    });
});

const compareResultForTemplate = number => {
    const templatePath            = getTemplatePath(number);
    const templateContent         = fs.readFileSync(templatePath, 'utf-8');
    const originalTemplateContent = GeneralUtils.toLF(templateContent);
    const tree                    = TreeBuilder.build(templatePath);
    const rootNode                = tree.rootNode;
    const actualContent           = rootNode.toString();

    expect(actualContent).toEqual(originalTemplateContent);
};

const getTemplatePath = number => {
    return `${Constants.specAutofixTemplatesDir}/template_${number}.isml`;
};
