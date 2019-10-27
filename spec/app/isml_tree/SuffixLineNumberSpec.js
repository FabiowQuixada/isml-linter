const SpecHelper  = require('../../SpecHelper');
const TreeBuilder = require('../../../src/isml_tree/TreeBuilder');
const Constants   = require('../../../src/Constants');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('sets <isif> element suffix line number I', () => {
        const rootNode     = getRootNodeFromTemplate(0);
        const mainIsifNode = rootNode.children[0].children[0];
        const divNode      = mainIsifNode.children[0];

        expect(divNode.suffixLineNumber      ).toEqual(3);
        expect(mainIsifNode.suffixLineNumber ).toEqual(4);
    });

    it('sets <isif> element suffix line number II', () => {
        const rootNode       = getRootNodeFromTemplate(1);
        const mainIsifNode   = rootNode.children[0].children[0];
        const preNode        = mainIsifNode.children[0];
        const codeNode       = preNode.children[0];
        const secondIsifNode = codeNode.children[1].children[0];

        expect(secondIsifNode.suffixLineNumber).toEqual(6);
        expect(codeNode.suffixLineNumber      ).toEqual(7);
        expect(preNode.suffixLineNumber       ).toEqual(7);
        expect(mainIsifNode.suffixLineNumber  ).toEqual(8);
    });

    it('sets suffix line number for a same-type sibling element', () => {
        const rootNode         = getRootNodeFromTemplate(2);
        const divNode          = rootNode.children[0];
        const firstButtonNode  = divNode.children[0];
        const secondButtonNode = divNode.children[1];

        expect(firstButtonNode.suffixLineNumber  ).toEqual(2);
        expect(secondButtonNode.suffixLineNumber ).toEqual(4);
        expect(divNode.suffixLineNumber          ).toEqual(5);
    });

    it('sets suffix line number for a childless node', () => {
        const rootNode    = getRootNodeFromTemplate(3);
        const divNode     = rootNode.children[0];
        const aNode       = divNode.children[0];
        const isprintNode = aNode.children[0];

        expect(isprintNode.suffixLineNumber ).toEqual(-1);
        expect(aNode.suffixLineNumber       ).toEqual(4);
        expect(divNode.suffixLineNumber     ).toEqual(5);
    });

    it('sets suffix line number for second child, childless node', () => {
        const rootNode = getRootNodeFromTemplate(4);
        const divNode  = rootNode.children[0];
        const spanNode = divNode.children[0];
        const aNode    = spanNode.children[1];

        expect(aNode.suffixLineNumber    ).toEqual(4);
        expect(spanNode.suffixLineNumber ).toEqual(5);
        expect(divNode.suffixLineNumber  ).toEqual(6);
    });

    it('sets suffix line number for second child, childless node II', () => {
        const rootNode     = getRootNodeFromTemplate(5);
        const formNode     = rootNode.children[0];
        const divNode      = formNode.children[0];
        const innerDivNode = divNode.children[1];

        expect(innerDivNode.suffixLineNumber ).toEqual(5);
        expect(divNode.suffixLineNumber      ).toEqual(6);
        expect(formNode.suffixLineNumber     ).toEqual(7);
    });

    it('sets suffix line number - Edge Case I', () => {
        const rootNode      = getRootNodeFromTemplate(6);
        const decoratorNode = rootNode.children[0];
        const divNode       = decoratorNode.children[0];
        const sectionNode   = divNode.children[1];

        expect(sectionNode.suffixLineNumber   ).toEqual(7);
        expect(divNode.suffixLineNumber       ).toEqual(8);
        expect(decoratorNode.suffixLineNumber ).toEqual(9);
    });

    it('sets suffix line number - Edge case II', () => {
        const rootNode = getRootNodeFromTemplate(7);
        const divNode  = rootNode.children[0];
        const div2Node = divNode.children[0];
        const p2Node   = div2Node.children[1];

        expect(p2Node.suffixLineNumber   ).toEqual(6);
        expect(div2Node.suffixLineNumber ).toEqual(7);
        expect(divNode.suffixLineNumber  ).toEqual(8);
    });

    it('sets suffix line number - Edge case III', () => {
        const rootNode = getRootNodeFromTemplate(8);
        const divNode  = rootNode.children[0];
        const div2Node = divNode.children[0];
        const aNode    = div2Node.children[0];

        expect(aNode.suffixLineNumber    ).toEqual(5);
        expect(div2Node.suffixLineNumber ).toEqual(6);
        expect(divNode.suffixLineNumber  ).toEqual(7);
    });

    it('sets suffix line number - Edge case IV', () => {
        const rootNode = getRootNodeFromTemplate(9);
        const divNode1 = rootNode.children[0];
        const divNode4 = divNode1.children[1];

        expect(divNode4.suffixLineNumber  ).toEqual(7);
    });
});

const getTemplatePath = number => {
    return `${Constants.specSuffixLineNumberTemplatesDir}/template_${number}.isml`;
};

const getTreeFromTemplate = number => {
    const templatePath = getTemplatePath(number);
    return TreeBuilder.build(templatePath);
};

const getRootNodeFromTemplate = number => {
    const tree = getTreeFromTemplate(number);
    return tree.rootNode;
};
