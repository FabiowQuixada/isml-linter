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
        expect(textNode.globalPos).toEqual(10 + SpecHelper.offset(textNode.lineNumber));
    });

    it('II', () => {
        const rootNode        = parseTemplate(1);
        const commentNode     = rootNode.children[0];
        const commentTextNode = commentNode.children[0];
        const tdNode          = rootNode.children[1];

        expect(commentNode.globalPos).toEqual(0);
        expect(commentTextNode.globalPos).toEqual(11 + SpecHelper.offset(commentTextNode.lineNumber));
        expect(tdNode.globalPos).toEqual(31 + SpecHelper.offset(tdNode.lineNumber));
    });

    it('III', () => {
        const rootNode = parseTemplate(2);
        const tdNode   = rootNode.children[0];
        const divNode  = tdNode.children[0];
        const textNode = divNode.children[0];

        expect(tdNode.globalPos).toEqual(0);
        expect(divNode.globalPos).toEqual(28 + SpecHelper.offset(divNode.lineNumber));
        expect(textNode.globalPos).toEqual(61 + SpecHelper.offset(textNode.lineNumber));
    });

    it('IV', () => {
        const rootNode  = parseTemplate(3);
        const tdNode    = rootNode.children[0];
        const divNode   = tdNode.children[0];
        const textNode  = divNode.children[0];
        const divNode2  = tdNode.children[1];
        const textNode2 = divNode2.children[0];

        expect(tdNode.globalPos).toEqual(0);
        expect(divNode.globalPos).toEqual(28 + SpecHelper.offset(divNode.lineNumber));
        expect(textNode.globalPos).toEqual(61 + SpecHelper.offset(textNode.lineNumber));
        expect(divNode2.globalPos).toEqual(97 + SpecHelper.offset(divNode2.lineNumber));
        expect(textNode2.globalPos).toEqual(133 + SpecHelper.offset(textNode2.lineNumber));
    });

    it('V', () => {
        const rootNode = parseTemplate(4);
        const tdNode   = rootNode.children[0];
        const divNode  = tdNode.children[0];
        const divNode2 = divNode.children[0];

        expect(tdNode.globalPos).toEqual(0);
        expect(divNode.globalPos).toEqual(28 + SpecHelper.offset(divNode.lineNumber));
        expect(divNode2.globalPos).toEqual(61 + SpecHelper.offset(divNode2.lineNumber));
    });

    it('VI', () => {
        const rootNode  = parseTemplate(5);
        const tdNode    = rootNode.children[0];
        const divNode   = tdNode.children[0];
        const divNode2  = divNode.children[0];
        const inputNode = divNode2.children[0];

        expect(tdNode.globalPos).toEqual(0);
        expect(divNode.globalPos).toEqual(28 + SpecHelper.offset(divNode.lineNumber));
        expect(divNode2.globalPos).toEqual(61 + SpecHelper.offset(divNode2.lineNumber));
        expect(inputNode.globalPos).toEqual(105 + SpecHelper.offset(inputNode.lineNumber));
    });

    it('VII', () => {
        const rootNode   = parseTemplate(6);
        const isloopNode = rootNode.children[0];
        const expNode    = isloopNode.children[0];

        expect(isloopNode.globalPos).toEqual(0);
        expect(expNode.globalPos).toEqual(56 + SpecHelper.offset(expNode.lineNumber));
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
        expect(optionNode.globalPos).toEqual(52 + SpecHelper.offset(optionNode.lineNumber));
    });

    it('X', () => {
        const rootNode      = parseTemplate(14);
        const iscommentNode = rootNode.children[0];
        const textNode      = iscommentNode.children[0];

        expect(iscommentNode.globalPos).toEqual(0);
        expect(textNode.globalPos).toEqual(15 + SpecHelper.offset(textNode.lineNumber));
    });

    it('XI', () => {
        const rootNode        = parseTemplate(8);
        const multiclauseNode = rootNode.children[0];
        const iselseNode      = multiclauseNode.children[1];
        const divNode         = iselseNode.children[0];

        expect(iselseNode.globalPos).toEqual(38 + SpecHelper.offset(iselseNode.lineNumber));
        expect(divNode.globalPos   ).toEqual(51 + SpecHelper.offset(divNode.lineNumber));
    });

    it('XII', () => {
        const rootNode        = parseTemplate(9);
        const multiclauseNode = rootNode.children[0];
        const isifNode        = multiclauseNode.children[0];
        const iselseNode      = multiclauseNode.children[1];
        const divNode         = iselseNode.children[0];

        expect(isifNode.globalPos  ).toEqual( 4 + SpecHelper.offset(isifNode.lineNumber));
        expect(iselseNode.globalPos).toEqual(46 + SpecHelper.offset(iselseNode.lineNumber));
        expect(divNode.globalPos   ).toEqual(63 + SpecHelper.offset(divNode.lineNumber));
    });

    it('XIII', () => {
        const rootNode        = parseTemplate(10);
        const multiclauseNode = rootNode.children[0];
        const iselseNode      = multiclauseNode.children[1];
        const expNode         = iselseNode.children[0];

        expect(expNode.globalPos).toEqual(53 + SpecHelper.offset(expNode.lineNumber));
    });

    it('XIV', () => {
        const rootNode = parseTemplate(11);
        const textNode = rootNode.children[1];

        expect(textNode.globalPos).toEqual(18 + SpecHelper.offset(textNode.lineNumber));
    });

    it('XV', () => {
        const rootNode = parseTemplate(16);
        const isifNode = rootNode.children[0].children[0].children[0];

        expect(isifNode.globalPos).toEqual(14 + SpecHelper.offset(isifNode.lineNumber));
    });

    it('XVI', () => {
        const rootNode = parseTemplate(12);
        const isifNode = rootNode.children[0].children[0].children[0];

        expect(isifNode.globalPos).toEqual(14 + SpecHelper.offset(isifNode.lineNumber));
    });

    it('XVII', () => {
        const rootNode   = parseTemplate(15);
        const iselseNode = rootNode.children[0].children[1];
        const isloopNode = iselseNode.children[0];
        const divNode    = isloopNode.children[0];

        expect(iselseNode.globalPos).toEqual(32 + SpecHelper.offset(isloopNode.lineNumber));
        expect(isloopNode.globalPos).toEqual(46 + SpecHelper.offset(isloopNode.lineNumber));
        expect(divNode.globalPos   ).toEqual(83 + SpecHelper.offset(divNode.lineNumber));
    });

    it('XVIII', () => {
        const rootNode   = parseTemplate(17);
        const iselseNode = rootNode.children[0].children[0].children[1];
        const divNode    = iselseNode.children[0];

        expect(iselseNode.globalPos).toEqual(43 + SpecHelper.offset(iselseNode.lineNumber));
        expect(divNode.globalPos   ).toEqual(64 + SpecHelper.offset(divNode.lineNumber));
    });

    it('XX', () => {
        const rootNode   = parseTemplate(18);
        const iselseNode = rootNode.children[0].children[1].children[0];
        const divNode    = iselseNode.children[0];
        const expNode    = divNode.children[0];

        expect(expNode.globalPos).toEqual(66 + SpecHelper.offset(expNode.lineNumber));
    });

    it('XXI', () => {
        const rootNode  = parseTemplate(19);
        const divNode   = rootNode.children[0];
        const labelNode = divNode.children[0];

        expect(labelNode.globalPos).toEqual(29 + SpecHelper.offset(labelNode.lineNumber));
    });

    it('XXII', () => {
        const rootNode   = parseTemplate(20);
        const divNode    = rootNode.children[0];
        const buttonNode = divNode.children[0];
        const textNode   = buttonNode.children[0];

        expect(textNode.globalPos).toEqual(94 + SpecHelper.offset(textNode.lineNumber));
    });
});

const parseTemplate = number => {
    const templatePath    = path.join(Constants.specGlobalPosTemplateDir, `template_${number}.isml`);
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const root            = TreeBuilder.parse(templateContent, undefined, undefined, templatePath);

    return root;
};
