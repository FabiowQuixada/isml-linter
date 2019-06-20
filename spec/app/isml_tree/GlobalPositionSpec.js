const fs          = require('fs');
const SpecHelper  = require('../../SpecHelper');
const Constants   = require('../../../src/app/Constants');
const TreeBuilder = require('../../../src/app/isml_tree/TreeBuilder');

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

    it('III', () => {
        const rootNode = parseTemplate(2);
        const tdNode   = rootNode.getChild(0);
        const divNode  = tdNode.getChild(0);
        const textNode = divNode.getChild(0);

        expect(tdNode.getGlobalPos()).toEqual(0);
        expect(divNode.getGlobalPos()).toEqual(28);
        expect(textNode.getGlobalPos()).toEqual(61);
    });

    it('IV', () => {
        const rootNode  = parseTemplate(3);
        const tdNode    = rootNode.getChild(0);
        const divNode   = tdNode.getChild(0);
        const textNode  = divNode.getChild(0);
        const divNode2  = tdNode.getChild(1);
        const textNode2 = divNode2.getChild(0);

        expect(tdNode.getGlobalPos()).toEqual(0);
        expect(divNode.getGlobalPos()).toEqual(28);
        expect(textNode.getGlobalPos()).toEqual(61);
        expect(divNode2.getGlobalPos()).toEqual(97);
        expect(textNode2.getGlobalPos()).toEqual(133);
    });

    it('V', () => {
        const rootNode = parseTemplate(4);
        const tdNode   = rootNode.getChild(0);
        const divNode  = tdNode.getChild(0);
        const divNode2 = divNode.getChild(0);

        expect(tdNode.getGlobalPos()).toEqual(0);
        expect(divNode.getGlobalPos()).toEqual(28);
        expect(divNode2.getGlobalPos()).toEqual(61);
    });

    it('VI', () => {
        const rootNode  = parseTemplate(5);
        const tdNode    = rootNode.getChild(0);
        const divNode   = tdNode.getChild(0);
        const divNode2  = divNode.getChild(0);
        const inputNode = divNode2.getChild(0);

        expect(tdNode.getGlobalPos()).toEqual(0);
        expect(divNode.getGlobalPos()).toEqual(28);
        expect(divNode2.getGlobalPos()).toEqual(61);
        expect(inputNode.getGlobalPos()).toEqual(105);
    });
});

const parseTemplate = number => {
    const filePath    = `${Constants.specGlobalPosTemplateDir}/template_${number}.isml`;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const root        = TreeBuilder.parse(fileContent, undefined, undefined, filePath);

    return root;
};
