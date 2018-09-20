const TreeBuilder = require('../../../app/isml_tree/TreeBuilder');
const SpecHelper = require('../../SpecHelper');
const Constants = require('../../../app/Constants');
const ErrorType = require('../../../app/ErrorType');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('creates a one-level-deep tree with node values', () => {
        const rootNode = TreeBuilder.build(getFilePath(10));

        expect(rootNode.getChild(0).getValue()).toEqual('<isset name="lineItem" value="${\'some value\'}" scope="page" />');
    });

    it('creates a tree with non-self-closing tags', () => {
        const rootNode = TreeBuilder.build(getFilePath(0));

        expect(rootNode.getChild(0).getValue()).toEqual('<div id="root_elem_2">');
    });

    it('creates a tree with a self-closed tag attribute-less grandchild', () => {
        const rootNode = TreeBuilder.build(getFilePath(0));

        expect(rootNode.getChild(0).getChild(0).getValue()).toEqual('<isprint value="some text" />');
    });

    it('creates a tree with a self-closed tag grandchild with attribute', () => {
        const rootNode = TreeBuilder.build(getFilePath(0));

        expect(rootNode.getChild(0).getChild(0).getValue()).toEqual('<isprint value="some text" />');
    });

    it('creates a tree with a self-closed tag grandchild', () => {
        const rootNode = TreeBuilder.build(getFilePath(11));

        expect(rootNode.getChild(0).getChild(0).getChild(0).getValue()).toEqual('<isif condition="${true}">');
    });

    it('recognizes a simple, raw isml expression: ${...}', () => {
        const rootNode = TreeBuilder.build(getFilePath(9));

        expect(rootNode.getChild(0).getChild(0).getValue()).toEqual('${3 < 4}');
    });

    it('recognizes an isml expression within an isml/html tag', () => {
        const rootNode = TreeBuilder.build(getFilePath(8));

        expect(rootNode.getChild(0).getChild(0).getChild(0).getValue()).toEqual('    <isset name="opliID" value="${opli.ID}" scope="page" />');
        expect(rootNode.getChild(0).getChild(0).getChild(0).getNumberOfChildren()).toEqual(0);
    });

    it('parses recursive elements', () => {
        const rootNode = TreeBuilder.build(getFilePath(7));

        expect(rootNode.getChild(0).getChild(0).getValue()).toEqual('<div class="inner">');
        expect(rootNode.getChild(0).getChild(0).getChild(0).getValue()).toEqual('<div class="further_in">');
    });

    it('handles "<" charecters in isml expressons', () => {
        const rootNode = TreeBuilder.build(getFilePath(6));

        expect(rootNode.getChild(0).getChild(0).getValue()).toEqual('${someValue < 3}');
    });

    it('handles "<" charecters in scripts', () => {
        const rootNode = TreeBuilder.build(getFilePath(5));

        expect(rootNode.getChild(0).getChild(0).getValue()).toEqual('var condition = someValue < 4;');

    });

    it('handles "<" characters in comments', () => {
        const rootNode = TreeBuilder.build(getFilePath(2));

        expect(rootNode.getChild(0).getChild(0).getValue()).toEqual('This comment has a \'<\' character.');
    });

    it('recognizes an isml element within a html element', () => {
        const rootNode = TreeBuilder.build(getFilePath(4));

        expect(rootNode.getChild(0).getValue()).toEqual('<span id="root_elem_17" <isif condition="${active}">class="active"</isif>>');
        expect(rootNode.getChild(0).getChild(0).getValue()).toEqual('Some content');
    });

    it('throws an exception upon invalid isml dom', () => {
        expect( () => { TreeBuilder.build(getFilePath(1)); } ).toThrow(ErrorType.INVALID_DOM);
    });

});

const getFilePath = number => {
    return `${Constants.specIsmlTreeTemplateDir}/sample_file_${number}.isml`;
};
