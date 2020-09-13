const fs           = require('fs');
const path         = require('path');
const SpecHelper   = require('../../SpecHelper');
const Constants    = require('../../../src/Constants');
const TreeBuilder  = require('../../../src/isml_tree/TreeBuilder');
const GeneralUtils = require('../../../src/util/GeneralUtils');

describe('Global Position on Unix', () => {

    beforeEach(() => {
        SpecHelper.beforeEach(false);
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('I', () => {
        const rootNode = parseTemplate(0);
        const divNode  = rootNode.children[0];
        const textNode = divNode.children[0];

        expect(divNode.globalPos ).toEqual(0);
        expect(textNode.globalPos).toEqual(10);
    });

    it('II', () => {
        const rootNode        = parseTemplate(1);
        const commentNode     = rootNode.children[0];
        const commentTextNode = commentNode.children[0];
        const tdNode          = rootNode.children[1];

        expect(commentNode.globalPos    ).toEqual(0);
        expect(commentTextNode.globalPos).toEqual(11);
        expect(tdNode.globalPos         ).toEqual(31);
    });

    it('III', () => {
        const rootNode = parseTemplate(2);
        const tdNode   = rootNode.children[0];
        const divNode  = tdNode.children[0];
        const textNode = divNode.children[0];

        expect(tdNode.globalPos  ).toEqual(0);
        expect(divNode.globalPos ).toEqual(28);
        expect(textNode.globalPos).toEqual(61);
    });

    it('IV', () => {
        const rootNode  = parseTemplate(3);
        const tdNode    = rootNode.children[0];
        const divNode   = tdNode.children[0];
        const textNode  = divNode.children[0];
        const divNode2  = tdNode.children[1];
        const textNode2 = divNode2.children[0];

        expect(tdNode.globalPos   ).toEqual(0);
        expect(divNode.globalPos  ).toEqual(28);
        expect(textNode.globalPos ).toEqual(61);
        expect(divNode2.globalPos ).toEqual(97);
        expect(textNode2.globalPos).toEqual(133);
    });

    it('V', () => {
        const rootNode = parseTemplate(4);
        const tdNode   = rootNode.children[0];
        const divNode  = tdNode.children[0];
        const divNode2 = divNode.children[0];

        expect(tdNode.globalPos  ).toEqual(0);
        expect(divNode.globalPos ).toEqual(28);
        expect(divNode2.globalPos).toEqual(61);
    });

    it('VI', () => {
        const rootNode  = parseTemplate(5);
        const tdNode    = rootNode.children[0];
        const divNode   = tdNode.children[0];
        const divNode2  = divNode.children[0];
        const inputNode = divNode2.children[0];

        expect(tdNode.globalPos   ).toEqual(0);
        expect(divNode.globalPos  ).toEqual(28);
        expect(divNode2.globalPos ).toEqual(61);
        expect(inputNode.globalPos).toEqual(105);
    });

    it('VII', () => {
        const rootNode   = parseTemplate(6);
        const isloopNode = rootNode.children[0];
        const expNode    = isloopNode.children[0];

        expect(isloopNode.globalPos).toEqual(0);
        expect(expNode.globalPos   ).toEqual(56);
    });

    it('VIII', () => {
        const rootNode   = parseTemplate(7);
        const isloopNode = rootNode.children[0];
        const optionNode = isloopNode.children[0];

        expect(isloopNode.globalPos).toEqual(0);
        expect(optionNode.globalPos).toEqual(52);
    });

    it('IX', () => {
        const rootNode   = parseTemplate(13);
        const isloopNode = rootNode.children[0];
        const optionNode = isloopNode.children[0];

        expect(isloopNode.globalPos).toEqual(0);
        expect(optionNode.globalPos).toEqual(52);
    });

    it('X', () => {
        const rootNode      = parseTemplate(14);
        const iscommentNode = rootNode.children[0];
        const textNode      = iscommentNode.children[0];

        expect(iscommentNode.globalPos).toEqual(0);
        expect(textNode.globalPos     ).toEqual(15);
    });

    it('XI', () => {
        const rootNode        = parseTemplate(8);
        const multiclauseNode = rootNode.children[0];
        const iselseNode      = multiclauseNode.children[1];
        const divNode         = iselseNode.children[0];

        expect(iselseNode.globalPos).toEqual(38);
        expect(divNode.globalPos   ).toEqual(51);
    });

    it('XII', () => {
        const rootNode        = parseTemplate(9);
        const multiclauseNode = rootNode.children[0];
        const isifNode        = multiclauseNode.children[0];
        const iselseNode      = multiclauseNode.children[1];
        const divNode         = iselseNode.children[0];

        expect(isifNode.globalPos  ).toEqual( 4);
        expect(iselseNode.globalPos).toEqual(46);
        expect(divNode.globalPos   ).toEqual(63);
    });

    it('XIII', () => {
        const rootNode        = parseTemplate(10);
        const multiclauseNode = rootNode.children[0];
        const iselseNode      = multiclauseNode.children[1];
        const expNode         = iselseNode.children[0];

        expect(expNode.globalPos).toEqual(53);
    });

    it('XIV', () => {
        const rootNode = parseTemplate(11);
        const textNode = rootNode.children[1];

        expect(textNode.globalPos).toEqual(18);
    });

    it('XV', () => {
        const rootNode = parseTemplate(16);
        const isifNode = rootNode.children[0].children[0].children[0];

        expect(isifNode.globalPos).toEqual(14);
    });

    it('XVI', () => {
        const rootNode = parseTemplate(12);
        const isifNode = rootNode.children[0].children[0].children[0];

        expect(isifNode.globalPos).toEqual(14);
    });

    it('XVII', () => {
        const rootNode   = parseTemplate(15);
        const iselseNode = rootNode.children[0].children[1];
        const isloopNode = iselseNode.children[0];
        const divNode    = isloopNode.children[0];

        expect(iselseNode.globalPos).toEqual(33);
        expect(isloopNode.globalPos).toEqual(46);
        expect(divNode.globalPos   ).toEqual(83);
    });

    it('XVIII', () => {
        const rootNode   = parseTemplate(17);
        const iselseNode = rootNode.children[0].children[0].children[1];
        const divNode    = iselseNode.children[0];

        expect(iselseNode.globalPos).toEqual(43);
        expect(divNode.globalPos   ).toEqual(64);
    });

    it('XX', () => {
        const rootNode   = parseTemplate(18);
        const iselseNode = rootNode.children[0].children[1].children[0];
        const divNode    = iselseNode.children[0];
        const expNode    = divNode.children[0];

        expect(expNode.globalPos).toEqual(66);
    });

    it('XXI', () => {
        const rootNode  = parseTemplate(19);
        const divNode   = rootNode.children[0];
        const labelNode = divNode.children[0];

        expect(labelNode.globalPos).toEqual(29);
    });

    it('XXII', () => {
        const rootNode   = parseTemplate(20);
        const divNode    = rootNode.children[0];
        const buttonNode = divNode.children[0];
        const textNode   = buttonNode.children[0];

        expect(textNode.globalPos).toEqual(94);
    });
});

const parseTemplate = number => {
    const templatePath      = path.join(Constants.specGlobalPosTemplateDir, `template_${number}.isml`);
    const templateContent   = fs.readFileSync(templatePath, 'utf-8');
    const lfTemplateContent = GeneralUtils.toLF(templateContent);
    const root              = TreeBuilder.parse(lfTemplateContent, undefined, undefined, templatePath);

    return root;
};
