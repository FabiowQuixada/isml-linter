const TreeBuilder = require('../../../app/isml_tree/TreeBuilder');
const SpecHelper  = require('../../SpecHelper');
const Constants   = require('../../../app/Constants');
const fs          = require('fs');

describe('Tree auto-fix', () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('prints tree as-is', () => {
        const templatePath            = getFilePath(0);
        const originalTemplateContent = fs.readFileSync(templatePath, 'utf-8');
        const rootNode                = TreeBuilder.build(templatePath).rootNode;
        const actualContent           = rootNode.getFullContent();

        expect(actualContent).toEqual(originalTemplateContent);
    });

    it('prints complex tree as-is', () => {
        const templatePath            = getFilePath(1);
        const originalTemplateContent = fs.readFileSync(templatePath, 'utf-8');
        const rootNode                = TreeBuilder.build(templatePath).rootNode;
        const actualContent           = rootNode.getFullContent();

        expect(actualContent).toEqual(originalTemplateContent);
    });
});

const getFilePath = number => {
    return `${Constants.specAutofixTemplatesDir}/template_${number}.isml`;
};
