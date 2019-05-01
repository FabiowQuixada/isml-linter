const fs          = require('fs');
const SpecHelper  = require('../../SpecHelper');
const Constants   = require('../../../app/Constants');
const TreeBuilder = require('../../../app/isml_tree/TreeBuilder');

describe('GlobalPosition', () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('I', () => {
        const rootNode = parseTemplate(0);
        const divNode  = rootNode.getChild(0);
        const textNode = divNode.getChild(0);

        expect(divNode.getGlobalPos()).toEqual(0);
        expect(textNode.getGlobalPos()).toEqual(10);
    });

    it('II', () => {
        const rootNode        = parseTemplate(1);
        const commentNode     = rootNode.getChild(0);
        const commentTextNode = commentNode.getChild(0);
        const tdNode          = rootNode.getChild(1);

        expect(commentNode.getGlobalPos()).toEqual(0);
        expect(commentTextNode.getGlobalPos()).toEqual(11);
        expect(tdNode.getGlobalPos()).toEqual(31);
    });
});

const parseTemplate = number => {
    const filePath    = `${Constants.specGlobalPosTemplateDir}/template_${number}.isml`;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const root        = TreeBuilder.parse(fileContent, undefined, undefined, filePath);

    return root;
};
