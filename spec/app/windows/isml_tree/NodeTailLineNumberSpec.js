const SpecHelper  = require('../../../SpecHelper');
const TreeBuilder = require('../../../../src/isml_tree/TreeBuilder');
const Constants   = require('../../../../src/Constants');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('sets <isif> element tail line number I', () => {
        const rootNode     = getRootNodeFromTemplate(0);
        const mainIsifNode = rootNode.children[0].children[0];
        const divNode      = mainIsifNode.children[0];

        expect(divNode.tailLineNumber      ).toEqual(3);
        expect(mainIsifNode.tailLineNumber ).toEqual(4);
    });

    it('sets <isif> element tail line number II', () => {
        const rootNode       = getRootNodeFromTemplate(1);
        const mainIsifNode   = rootNode.children[0].children[0];
        const preNode        = mainIsifNode.children[0];
        const codeNode       = preNode.children[0];
        const secondIsifNode = codeNode.children[1].children[0];

        expect(secondIsifNode.tailLineNumber).toEqual(6);
        expect(codeNode.tailLineNumber      ).toEqual(7);
        expect(preNode.tailLineNumber       ).toEqual(7);
        expect(mainIsifNode.tailLineNumber  ).toEqual(8);
    });

    it('sets tail line number for a same-type sibling element', () => {
        const rootNode         = getRootNodeFromTemplate(2);
        const divNode          = rootNode.children[0];
        const firstButtonNode  = divNode.children[0];
        const secondButtonNode = divNode.children[1];

        expect(firstButtonNode.tailLineNumber  ).toEqual(2);
        expect(secondButtonNode.tailLineNumber ).toEqual(4);
        expect(divNode.tailLineNumber          ).toEqual(5);
    });

    it('sets tail line number for a childless node', () => {
        const rootNode    = getRootNodeFromTemplate(3);
        const divNode     = rootNode.children[0];
        const aNode       = divNode.children[0];
        const isprintNode = aNode.children[0];

        expect(isprintNode.tailLineNumber ).toEqual(null);
        expect(aNode.tailLineNumber       ).toEqual(4);
        expect(divNode.tailLineNumber     ).toEqual(5);
    });

    it('sets tail line number for second child, childless node', () => {
        const rootNode = getRootNodeFromTemplate(4);
        const divNode  = rootNode.children[0];
        const spanNode = divNode.children[0];
        const aNode    = spanNode.children[1];

        expect(aNode.tailLineNumber    ).toEqual(4);
        expect(spanNode.tailLineNumber ).toEqual(5);
        expect(divNode.tailLineNumber  ).toEqual(6);
    });

    it('sets tail line number for second child, childless node II', () => {
        const rootNode     = getRootNodeFromTemplate(5);
        const formNode     = rootNode.children[0];
        const divNode      = formNode.children[0];
        const innerDivNode = divNode.children[1];

        expect(innerDivNode.tailLineNumber ).toEqual(5);
        expect(divNode.tailLineNumber      ).toEqual(6);
        expect(formNode.tailLineNumber     ).toEqual(7);
    });

    it('sets tail line number - Edge Case I', () => {
        const rootNode      = getRootNodeFromTemplate(6);
        const decoratorNode = rootNode.children[0];
        const divNode       = decoratorNode.children[0];
        const sectionNode   = divNode.children[1];

        expect(sectionNode.tailLineNumber   ).toEqual(7);
        expect(divNode.tailLineNumber       ).toEqual(8);
        expect(decoratorNode.tailLineNumber ).toEqual(9);
    });

    it('sets tail line number - Edge case II', () => {
        const rootNode = getRootNodeFromTemplate(7);
        const divNode  = rootNode.children[0];
        const div2Node = divNode.children[0];
        const p2Node   = div2Node.children[1];

        expect(p2Node.tailLineNumber   ).toEqual(6);
        expect(div2Node.tailLineNumber ).toEqual(7);
        expect(divNode.tailLineNumber  ).toEqual(8);
    });

    it('sets tail line number - Edge case III', () => {
        const rootNode = getRootNodeFromTemplate(8);
        const divNode  = rootNode.children[0];
        const div2Node = divNode.children[0];
        const aNode    = div2Node.children[0];

        expect(aNode.tailLineNumber    ).toEqual(5);
        expect(div2Node.tailLineNumber ).toEqual(6);
        expect(divNode.tailLineNumber  ).toEqual(7);
    });

    it('sets tail line number - Edge case IV', () => {
        const rootNode = getRootNodeFromTemplate(9);
        const divNode1 = rootNode.children[0];
        const divNode4 = divNode1.children[1];

        expect(divNode4.tailLineNumber).toEqual(7);
    });
});

const getTemplatePath = number => {
    return SpecHelper.getTemplatePath(Constants.specTailLineNumberTemplatesDir, number);
};

const getTreeFromTemplate = number => {
    const templatePath = getTemplatePath(number);
    return TreeBuilder.build(templatePath);
};

const getRootNodeFromTemplate = number => {
    const tree = getTreeFromTemplate(number);
    return tree.rootNode;
};
