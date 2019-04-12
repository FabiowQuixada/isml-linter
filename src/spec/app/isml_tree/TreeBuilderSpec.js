const TreeBuilder    = require('../../../app/isml_tree/TreeBuilder');
const SpecHelper     = require('../../SpecHelper');
const Constants      = require('../../../app/Constants');
const ExceptionUtils = require('../../../app/ExceptionUtils');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('creates a one-level-deep tree with node values', () => {
        const rootNode = TreeBuilder.build(getFilePath(10)).rootNode;

        expect(rootNode.getChild(0).getValue()).toEqual('<isset name="lineItem" value="${\'some value\'}" scope="page" />');
    });

    it('creates a tree with non-self-closing tags', () => {
        const rootNode = TreeBuilder.build(getFilePath(0)).rootNode;

        expect(rootNode.getChild(0).getValue()).toEqual('<div id="root_elem_2">');
    });

    it('creates a tree with a self-closed tag attribute-less grandchild', () => {
        const rootNode = TreeBuilder.build(getFilePath(0)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('<isprint value="some text" />');
    });

    it('creates a tree with a self-closed tag grandchild with attribute', () => {
        const rootNode = TreeBuilder.build(getFilePath(0)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('<isprint value="some text" />');
    });

    it('creates a tree with a self-closed tag grandchild', () => {
        const rootNode = TreeBuilder.build(getFilePath(11)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getChild(0).getValue().trim()).toEqual('<isif condition="${true}">');
    });

    it('recognizes a simple, raw isml expression: ${...}', () => {
        const rootNode = TreeBuilder.build(getFilePath(9)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('${3 < 4}');
    });

    it('recognizes an isml expression within an isml/html tag', () => {
        const rootNode = TreeBuilder.build(getFilePath(8)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getChild(0).getValue()).toEqual('\n    <isset name="opliID" value="${opli.ID}" scope="page" />');
        expect(rootNode.getChild(0).getChild(0).getChild(0).getNumberOfChildren()).toEqual(0);
    });

    it('parses recursive elements', () => {
        const rootNode = TreeBuilder.build(getFilePath(7)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('<div class="inner">');
        expect(rootNode.getChild(0).getChild(0).getChild(0).getValue().trim()).toEqual('<div class="further_in">');
    });

    it('handles "<" charecters in isml expressons', () => {
        const rootNode = TreeBuilder.build(getFilePath(6)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('${someValue < 3}');
    });

    it('handles "<" charecters in scripts', () => {
        const rootNode = TreeBuilder.build(getFilePath(5)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('var condition = someValue < 4;');
    });

    it('parses <isif> tag with a "<" character in its condition', () => {
        const rootNode = TreeBuilder.build(getFilePath(3)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getChild(0).getValue()).toEqual('\n    <div class="clause_1" />');
    });

    it('handles "<" characters in comments', () => {
        const rootNode = TreeBuilder.build(getFilePath(2)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('This comment has a \'<\' character.');
    });

    it('recognizes an isml element within a html element', () => {
        const rootNode = TreeBuilder.build(getFilePath(4)).rootNode;

        expect(rootNode.getChild(0).getValue()).toEqual('<span id="root_elem_17" <isif condition="${active}">class="active"</isif>>');
        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('Some content');
    });

    it('sets the correct height fo multi-clause children', () => {
        const rootNode = TreeBuilder.build(getFilePath(12)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getChild(0).getChild(0).getHeight()).toEqual(3);
    });

    it('parses nested <isif> tags', () => {
        const rootNode = TreeBuilder.build(getFilePath(13)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getChild(0).getChild(1).getChild(0).getHeight()).toEqual(3);
    });

    it('throws an exception upon invalid isml dom', () => {
        const expectedMessage = ExceptionUtils.unbalancedElementError('div', 2).message;
        const tree            = TreeBuilder.build(getFilePath(1));

        expect(tree.exception.message).toEqual(expectedMessage);
    });

    it('parses hard-coded strings', () => {
        const rootNode = TreeBuilder.build(getFilePath(14)).rootNode;

        expect(rootNode.getChild(0).getValue()).toEqual('<span>');
        expect(rootNode.getChild(1).getValue().trim()).toEqual('A hard-coded string');
        expect(rootNode.getChild(2).getChild(0).getValue().trim()).toEqual('Another hard-coded string');
    });

    it('parses a child "isif" tag', () => {
        const rootNode    = TreeBuilder.build(getFilePath(16)).rootNode;
        const trNode      = rootNode.getChild(0);
        const commentNode = rootNode.getChild(1);

        expect(trNode.getValue()).toEqual('\n<tr class="cart_row lineItem-${lineItem.getUUID()} product-${productLineItem.productID}">');
        expect(trNode.getLineNumber()).toEqual(2);
        expect(trNode.getNumberOfChildren()).toEqual(1);

        expect(commentNode.getValue()).toEqual('\n\n\n<iscomment>');
        expect(commentNode.getLineNumber()).toEqual(23);
        expect(commentNode.getHeight()).toEqual(1);
    });

    it('identifies ISML expressions I', () => {
        const rootNode  = TreeBuilder.build(getFilePath(18)).rootNode;
        const availNode = rootNode.getChild(2);

        expect(availNode.getValue()).toEqual('\n<div class="product-availability">');
        expect(availNode.getLineNumber()).toEqual(23);
        expect(availNode.getNumberOfChildren()).toEqual(1);
    });

    it('identifies ISML expressions II', () => {
        const rootNode     = TreeBuilder.build(getFilePath(17)).rootNode;
        const ifNode       = rootNode.getChild(0).getChild(0);
        const nestedIfNode = ifNode.getChild(0).getChild(0);

        expect(nestedIfNode.getValue()).toEqual('\n    <isif condition="${c2}">');
        expect(nestedIfNode.getLineNumber()).toEqual(2);
        expect(nestedIfNode.getNumberOfChildren()).toEqual(1);
    });

    it('identifies ISML expressions III', () => {
        const rootNode = TreeBuilder.build(getFilePath(19)).rootNode;
        const setNode  = rootNode.getChild(2);

        expect(setNode.getValue()).toEqual('\n<isset value="${abc}" />');
        expect(setNode.getLineNumber()).toEqual(7);
        expect(setNode.getNumberOfChildren()).toEqual(0);
    });

    it('identifies HTML comments', () => {
        const rootNode        = TreeBuilder.build(getFilePath(24)).rootNode;
        const htmlCommentNode = rootNode.getChild(0);
        const ifNode          = rootNode.getChild(1).getChild(0);

        expect(htmlCommentNode.getValue()).toEqual('<!-- This is an HTML comment -->');
        expect(htmlCommentNode.getLineNumber()).toEqual(1);
        expect(htmlCommentNode.getNumberOfChildren()).toEqual(0);

        expect(ifNode.getValue()).toEqual('\n<isif condition="${condition}">');
        expect(ifNode.getLineNumber()).toEqual(2);
        expect(ifNode.getNumberOfChildren()).toEqual(1);
    });

    it('handles empty "isif" tag', () => {
        const result   = TreeBuilder.build(getFilePath(20));
        const rootNode = result.rootNode;
        const divNode  = rootNode.getChild(0);
        const ifNode   = divNode.getChild(0).getChild(0);

        expect(divNode.getValue()).toEqual('<div <isif condition="${condition1}"></isif>>');
        expect(divNode.getLineNumber()).toEqual(1);
        expect(divNode.getNumberOfChildren()).toEqual(1);

        expect(ifNode.getValue()).toEqual('\n    <isif condition="${condition2}">');
        expect(ifNode.getLineNumber()).toEqual(2);
        expect(ifNode.getNumberOfChildren()).toEqual(0);
    });

    it('handle one-char condition "if" tag', () => {
        const result   = TreeBuilder.build(getFilePath(21));
        const rootNode = result.rootNode;
        const divNode  = rootNode.getChild(0);
        const ifNode   = divNode.getChild(0).getChild(0);

        expect(divNode.getValue()).toEqual('<div <isif condition="${c}"></isif>>');
        expect(divNode.getLineNumber()).toEqual(1);
        expect(divNode.getNumberOfChildren()).toEqual(1);

        expect(ifNode.getValue()).toEqual('\n    <isif condition="${c2}">');
        expect(ifNode.getLineNumber()).toEqual(2);
        expect(ifNode.getNumberOfChildren()).toEqual(0);
    });

    it('identifies a html comment as self-closing tag', () => {
        const rootNode        = TreeBuilder.build(getFilePath(25)).rootNode;
        const htmlCommentNode = rootNode.getChild(0);
        const mainDivNode     = rootNode.getChild(1);
        const childDivNode    = mainDivNode.getChild(0);

        expect(rootNode.getNumberOfChildren()).toEqual(2);

        expect(htmlCommentNode.getValue()).toEqual('\n<!--- make drop down -->');
        expect(htmlCommentNode.getLineNumber()).toEqual(2);
        expect(htmlCommentNode.getNumberOfChildren()).toEqual(0);

        expect(mainDivNode.getValue()).toEqual('\n<div class="row">');
        expect(mainDivNode.getLineNumber()).toEqual(3);
        expect(mainDivNode.getNumberOfChildren()).toEqual(1);

        expect(childDivNode.getValue()).toEqual('\n    <div class="col-sm-6">');
        expect(childDivNode.getLineNumber()).toEqual(4);
        expect(childDivNode.getNumberOfChildren()).toEqual(0);
    });

    it('identifies style tags', () => {
        const filePath = getFilePath(26);
        const rootNode = TreeBuilder.build(filePath).rootNode;
        const styleTag = rootNode.getChild(4);

        expect(styleTag.getValue()).toEqual('<style type="text/css">');
        expect(styleTag.getLineNumber()).toEqual(5);
        expect(styleTag.getNumberOfChildren()).toEqual(1);
    });

    it('handles conditional HTML comments', () => {
        const filePath            = getFilePath(26);
        const rootNode            = TreeBuilder.build(filePath).rootNode;
        const conditionTag        = rootNode.getChild(1);
        const metaTag             = rootNode.getChild(2);
        const closingConditionTag = rootNode.getChild(3);
        const afterTag            = rootNode.getChild(4);

        expect(conditionTag.getValue()).toEqual('\n<!--[if !mso]><!-- -->\n');
        expect(conditionTag.getLineNumber()).toEqual(2);
        expect(conditionTag.getNumberOfChildren()).toEqual(0);

        expect(metaTag.getValue()).toEqual('    <meta content="IE=edge" http-equiv="X-UA-Compatible" />');
        expect(metaTag.getLineNumber()).toEqual(3);
        expect(metaTag.getNumberOfChildren()).toEqual(0);

        expect(closingConditionTag.getValue()).toEqual('\n<!--<![endif]-->\n');
        expect(closingConditionTag.getLineNumber()).toEqual(4);
        expect(closingConditionTag.getNumberOfChildren()).toEqual(0);

        expect(afterTag.getValue()).toEqual('<style type="text/css">');
        expect(afterTag.getLineNumber()).toEqual(5);
        expect(afterTag.getNumberOfChildren()).toEqual(1);
    });

    it('allows opening "isif" tags with slash: <isif />', () => {
        const filePath = getFilePath(28);
        const rootNode = TreeBuilder.build(filePath).rootNode;
        const isifNode = rootNode.getChild(0).getChild(0);
        const divNode  = isifNode.getChild(0);

        expect(isifNode.getValue()).toEqual('<isif condition="${true}"/>');
        expect(isifNode.getLineNumber()).toEqual(1);
        expect(isifNode.getNumberOfChildren()).toEqual(1);

        expect(divNode.getValue()).toEqual('\n    <div/>');
        expect(divNode.getLineNumber()).toEqual(2);
        expect(divNode.getNumberOfChildren()).toEqual(0);
    });

    it('parses script tag with attributes', () => {
        const filePath   = getFilePath(29);
        const rootNode   = TreeBuilder.build(filePath).rootNode;
        const scriptNode = rootNode.getChild(0);

        expect(scriptNode.getValue()).toEqual('<script type="text/javascript">');
    });

    it('parses DOCTYPE tag', () => {
        const filePath   = getFilePath(30);
        const rootNode   = TreeBuilder.build(filePath).rootNode;
        const scriptNode = rootNode.getChild(0);

        expect(scriptNode.getValue()).toEqual('<!DOCTYPE html>');
    });

    it('allows void element if HTML 5 config is not disabled', () => {
        const filePath = getFilePath(31);
        const rootNode = TreeBuilder.build(filePath).rootNode;
        const metaNode = rootNode.getChild(0).getChild(0);

        expect(metaNode.getValue()).toEqual('\n    <meta http-equiv="refresh" content="2;url=${pdict.Location}">');
    });

    it('parses custom module with "_" char in its name', () => {
        const filePath         = getFilePath(33);
        const newLocal         = TreeBuilder.build(filePath);
        const rootNode         = newLocal.rootNode;
        const customModuleNode = rootNode.getChild(0);

        expect(customModuleNode.getValue()).toEqual('<ismycustom_module p_attribute="${\'value\'}"/>');
    });

    it('allows tags within iscomment tags', () => {
        const filePath    = getFilePath(34);
        const newLocal    = TreeBuilder.build(filePath);
        const rootNode    = newLocal.rootNode;
        const commentNode = rootNode.getChild(0);

        expect(commentNode.getValue()).toEqual('<iscomment>');
    });
});

const getFilePath = number => {
    return `${Constants.specIsmlTreeTemplateDir}/template_${number}.isml`;
};
