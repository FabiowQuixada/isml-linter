const TreeBuilder = require('../../../app/isml_tree/TreeBuilder');
const SpecHelper = require('../../SpecHelper');
const Constants = require('../../../app/Constants');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('creates a one-level-deep tree with correct number of children', () => {
        const rootNode = TreeBuilder.build(getFilePath(0));

        expect(rootNode.getNumberOfChildren()).toEqual(13);
    });

    it('creates a one-level-deep tree with node values', () => {
        const rootNode = TreeBuilder.build(getFilePath(0));

        expect(rootNode.getChild(4).getValue()).toEqual('<isset name="lineItem" value="${\'some value\'}" scope="page" />');
    });

    it('creates a tree with non-self-closing tags', () => {
        const rootNode = TreeBuilder.build(getFilePath(0));

        expect(rootNode.getChild(2).getValue()).toEqual('<div>');
    });

    it('creates a tree with a self-closed tag attribute-less grandchild', () => {
        const rootNode = TreeBuilder.build(getFilePath(0));

        expect(rootNode.getChild(2).getChild(0).getValue()).toEqual('<isprint value="some text" />');
    });

    it('creates a tree with a self-closed tag grandchild with attribute', () => {
        const rootNode = TreeBuilder.build(getFilePath(0));

        expect(rootNode.getChild(2).getChild(0).getValue()).toEqual('<isprint value="some text" />');
    });

    it('creates a tree with a self-closed tag grandchild', () => {
        const rootNode = TreeBuilder.build(getFilePath(0));

        expect(rootNode.getChild(3).getChild(0).getValue()).toEqual('<isif condition="${true}">');
    });

    it('recognizes a simple, raw isml expression: ${...}', () => {
        const rootNode = TreeBuilder.build(getFilePath(0));

        expect(rootNode.getChild(9).getChild(0).getValue()).toEqual('${3 < 4}');
    });

    it('recognizes an isml expression within an isml/html tag', () => {
        const rootNode = TreeBuilder.build(getFilePath(0));

        expect(rootNode.getChild(11).getChild(0).getValue()).toEqual('<isset name="opliID" value="${opli.ID}" scope="page" />');
        expect(rootNode.getChild(11).getChild(0).getNumberOfChildren()).toEqual(0);
    });

    it('parses recursive elements', () => {
        const rootNode = TreeBuilder.build(getFilePath(0));

        expect(rootNode.getChild(12).getChild(0).getValue()).toEqual('<div class="inner">');
        expect(rootNode.getChild(12).getChild(0).getChild(0).getValue()).toEqual('<div class="further_in">');
    });
});

const getFilePath = number => {
    return `${Constants.specIsmlTreeTemplateDir}/sample_file_${number}.isml`;
};
