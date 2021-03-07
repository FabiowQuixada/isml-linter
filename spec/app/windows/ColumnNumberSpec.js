const SpecHelper  = require('../../SpecHelper');
const TreeBuilder = require('../../../src/isml_tree/TreeBuilder');
const Constants   = require('../../../src/Constants');

describe('TreeBuilder', () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('sets column number for a very simple html DOM', () => {
        const rootNode    = getTemplateTreeRootNode(0);
        const divNode     = rootNode.children[0];
        const spanNode    = divNode.children[0];
        const isprintNode = spanNode.children[0];

        expect(divNode.columnNumber        ).toEqual(1);
        expect(divNode.suffixColumnNumber  ).toEqual(1);
        expect(spanNode.columnNumber       ).toEqual(5);
        expect(spanNode.suffixColumnNumber ).toEqual(5);
        expect(isprintNode.columnNumber    ).toEqual(9);
    });

    it('sets column number for elements in the same row as its parent', () => {
        const rootNode      = getTemplateTreeRootNode(1);
        const iscommentNode = rootNode.children[0];
        const textNode      = iscommentNode.children[0];

        expect(iscommentNode.columnNumber       ).toEqual(1);
        expect(textNode.columnNumber            ).toEqual(13);
        expect(iscommentNode.suffixColumnNumber ).toEqual(25);
    });

    it('sets column number for elements in the same row as its parent II', () => {
        const rootNode      = getTemplateTreeRootNode(2);
        const divNode       = rootNode.children[1];
        const iscommentNode = divNode.children[0];
        const textNode      = iscommentNode.children[0];

        expect(divNode.columnNumber             ).toEqual(1);
        expect(iscommentNode.columnNumber       ).toEqual(6);
        expect(textNode.columnNumber            ).toEqual(17);
        expect(iscommentNode.suffixColumnNumber ).toEqual(29);
        expect(divNode.suffixColumnNumber       ).toEqual(41);
    });

});

const getTemplateTreeRootNode = number => {
    const templatePath = SpecHelper.getTemplatePath(Constants.specColumnNumberTemplateDir, number);

    return TreeBuilder.build(templatePath).rootNode;
};
