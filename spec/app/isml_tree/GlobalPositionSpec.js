const fs          = require('fs');
const path        = require('path');
const SpecHelper  = require('../../SpecHelper');
const Constants   = require('../../../src/Constants');
const TreeBuilder = require('../../../src/isml_tree/TreeBuilder');

describe('GlobalPosition', () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('I', () => {
        const rootNode = parseTemplate(0);
        const divNode  = rootNode.children[0];
        const textNode = divNode.children[0];

        expect(divNode.globalPos).toEqual(0);
        expect(textNode.globalPos).toEqual(10);
    });

    it('II', () => {
        const rootNode        = parseTemplate(1);
        const commentNode     = rootNode.children[0];
        const commentTextNode = commentNode.children[0];
        const tdNode          = rootNode.children[1];

        expect(commentNode.globalPos).toEqual(0);
        expect(commentTextNode.globalPos).toEqual(11);
        expect(tdNode.globalPos).toEqual(31);
    });

    it('III', () => {
        const rootNode = parseTemplate(2);
        const tdNode   = rootNode.children[0];
        const divNode  = tdNode.children[0];
        const textNode = divNode.children[0];

        expect(tdNode.globalPos).toEqual(0);
        expect(divNode.globalPos).toEqual(28);
        expect(textNode.globalPos).toEqual(61);
    });

    it('IV', () => {
        const rootNode  = parseTemplate(3);
        const tdNode    = rootNode.children[0];
        const divNode   = tdNode.children[0];
        const textNode  = divNode.children[0];
        const divNode2  = tdNode.children[1];
        const textNode2 = divNode2.children[0];

        expect(tdNode.globalPos).toEqual(0);
        expect(divNode.globalPos).toEqual(28);
        expect(textNode.globalPos).toEqual(61);
        expect(divNode2.globalPos).toEqual(97);
        expect(textNode2.globalPos).toEqual(133);
    });

    it('V', () => {
        const rootNode = parseTemplate(4);
        const tdNode   = rootNode.children[0];
        const divNode  = tdNode.children[0];
        const divNode2 = divNode.children[0];

        expect(tdNode.globalPos).toEqual(0);
        expect(divNode.globalPos).toEqual(28);
        expect(divNode2.globalPos).toEqual(61);
    });

    it('VI', () => {
        const rootNode  = parseTemplate(5);
        const tdNode    = rootNode.children[0];
        const divNode   = tdNode.children[0];
        const divNode2  = divNode.children[0];
        const inputNode = divNode2.children[0];

        expect(tdNode.globalPos).toEqual(0);
        expect(divNode.globalPos).toEqual(28);
        expect(divNode2.globalPos).toEqual(61);
        expect(inputNode.globalPos).toEqual(105);
    });

    it('VII', () => {
        const rootNode   = parseTemplate(6);
        const isloopNode = rootNode.children[0];
        const expNode    = isloopNode.children[0];

        expect(isloopNode.globalPos).toEqual(0);
        expect(expNode.globalPos).toEqual(56);
    });

    it('VIII', () => {
        const rootNode   = parseTemplate(7);
        const isloopNode = rootNode.children[0];
        const optionNode = isloopNode.children[0];

        expect(isloopNode.globalPos).toEqual(0);
        expect(optionNode.globalPos).toEqual(52 + SpecHelper.offset(optionNode.lineNumber));
    });

    it('IX', () => {
        const rootNode   = parseTemplate(13);
        const isloopNode = rootNode.children[0];
        const optionNode = isloopNode.children[0];

        expect(isloopNode.globalPos).toEqual(0);
        expect(optionNode.globalPos).toEqual(53);
    });

    it('X', () => {
        const rootNode      = parseTemplate(14);
        const iscommentNode = rootNode.children[0];
        const textNode      = iscommentNode.children[0];

        expect(iscommentNode.globalPos).toEqual(0);
        expect(textNode.globalPos).toEqual(15 + SpecHelper.offset(textNode.lineNumber));
    });

});

const parseTemplate = number => {
    const templatePath    = path.join(Constants.specGlobalPosTemplateDir, `template_${number}.isml`);
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const root            = TreeBuilder.parse(templateContent, undefined, undefined, templatePath);

    return root;
};
