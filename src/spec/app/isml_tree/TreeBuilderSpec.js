const TreeBuilder    = require('../../../app/isml_tree/TreeBuilder');
const SpecHelper     = require('../../SpecHelper');
const Constants      = require('../../../app/Constants');
const ExceptionUtils = require('../../../app/util/ExceptionUtils');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });


    it('creates a tree with non-self-closing tags', () => {
        const rootNode = getRootNodeFromTemplate(0);

        expect(rootNode.getChild(0).getValue()).toEqual('<div id="root_elem_2">');
    });

    it('creates a tree with a self-closed tag attribute-less grandchild', () => {
        const rootNode = getRootNodeFromTemplate(0);

        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('<isprint value="some text" />');
    });

    it('creates a tree with a self-closed tag grandchild with attribute', () => {
        const rootNode = getRootNodeFromTemplate(0);

        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('<isprint value="some text" />');
    });

    it('throws an exception upon invalid isml dom', () => {
        const expectedMessage = ExceptionUtils.unbalancedElementError('div', 2).message;
        const tree            = getTreeFromTemplate(1);

        expect(tree.exception.message).toEqual(expectedMessage);
    });

    it('handles "<" characters in comments', () => {
        const rootNode = getRootNodeFromTemplate(2);

        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('This comment has a \'<\' character.');
    });

    it('parses <isif> tag with a "<" character in its condition', () => {
        const rootNode = getRootNodeFromTemplate(3);

        expect(rootNode.getChild(0).getChild(0).getChild(0).getValue()).toEqual('\n    <div class="clause_1" />');
    });

    it('recognizes an isml element within a html element', () => {
        const rootNode = getRootNodeFromTemplate(4);

        expect(rootNode.getChild(0).getValue()).toEqual('<span id="root_elem_17" <isif condition="${active}">class="active"</isif>>');
        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('Some content');
    });

    it('handles "<" charecters in scripts', () => {
        const rootNode = getRootNodeFromTemplate(5);

        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('var condition = someValue < 4;');
    });

    it('handles "<" charecters in isml expressons', () => {
        const rootNode = getRootNodeFromTemplate(6);

        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('${someValue < 3}');
    });

    it('parses recursive elements', () => {
        const rootNode = getRootNodeFromTemplate(7);

        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('<div class="inner">');
        expect(rootNode.getChild(0).getChild(0).getChild(0).getValue().trim()).toEqual('<div class="further_in">');
    });

    it('recognizes an isml expression within an isml/html tag', () => {
        const rootNode = getRootNodeFromTemplate(8);

        expect(rootNode.getChild(0).getChild(0).getChild(0).getValue()).toEqual('\n    <isset name="opliID" value="${opli.ID}" scope="page" />');
        expect(rootNode.getChild(0).getChild(0).getChild(0).getNumberOfChildren()).toEqual(0);
    });

    it('recognizes a simple, raw isml expression: ${...}', () => {
        const rootNode = getRootNodeFromTemplate(9);

        expect(rootNode.getChild(0).getChild(0).getValue().trim()).toEqual('${3 < 4}');
    });

    it('creates a one-level-deep tree with node values', () => {
        const rootNode = getRootNodeFromTemplate(10);

        expect(rootNode.getChild(0).getValue()).toEqual('<isset name="lineItem" value="${\'some value\'}" scope="page" />');
    });

    it('creates a tree with a self-closed tag grandchild', () => {
        const rootNode = getRootNodeFromTemplate(11);

        expect(rootNode.getChild(0).getChild(0).getChild(0).getValue().trim()).toEqual('<isif condition="${true}">');
    });

    it('sets the correct depth fo multi-clause children', () => {
        const rootNode = getRootNodeFromTemplate(12);

        expect(rootNode.getChild(0).getChild(0).getChild(0).getChild(0).getDepth()).toEqual(3);
    });

    it('parses nested <isif> tags', () => {
        const rootNode = getRootNodeFromTemplate(13);

        expect(rootNode.getChild(0).getChild(0).getChild(0).getChild(1).getChild(0).getDepth()).toEqual(3);
    });

    it('parses hard-coded strings', () => {
        const rootNode = getRootNodeFromTemplate(14);

        expect(rootNode.getChild(0).getValue()).toEqual('<span>');
        expect(rootNode.getChild(1).getValue().trim()).toEqual('A hard-coded string');
        expect(rootNode.getChild(2).getChild(0).getValue().trim()).toEqual('Another hard-coded string');
    });

    it('parses a child "isif" tag', () => {
        const rootNode    = getRootNodeFromTemplate(16);
        const trNode      = rootNode.getChild(0);
        const commentNode = rootNode.getChild(1);

        expect(trNode.getValue()).toEqual('\n<tr class="cart_row lineItem-${lineItem.getUUID()} product-${productLineItem.productID}">');
        expect(trNode.getLineNumber()).toEqual(2);
        expect(trNode.getNumberOfChildren()).toEqual(1);

        expect(commentNode.getValue()).toEqual('\n\n\n<iscomment>');
        expect(commentNode.getLineNumber()).toEqual(23);
        expect(commentNode.getDepth()).toEqual(1);
    });

    it('identifies ISML expressions I', () => {
        const rootNode     = getRootNodeFromTemplate(17);
        const ifNode       = rootNode.getChild(0).getChild(0);
        const nestedIfNode = ifNode.getChild(0).getChild(0);

        expect(nestedIfNode.getValue()).toEqual('\n    <isif condition="${c2}">');
        expect(nestedIfNode.getLineNumber()).toEqual(2);
        expect(nestedIfNode.getNumberOfChildren()).toEqual(1);
    });

    it('identifies ISML expressions II', () => {
        const rootNode  = getRootNodeFromTemplate(18);
        const availNode = rootNode.getChild(2);

        expect(availNode.getValue()).toEqual('\n<div class="product-availability">');
        expect(availNode.getLineNumber()).toEqual(23);
        expect(availNode.getNumberOfChildren()).toEqual(1);
    });

    it('identifies ISML expressions III', () => {
        const rootNode = getRootNodeFromTemplate(19);
        const setNode  = rootNode.getChild(2);

        expect(setNode.getValue()).toEqual('\n<isset value="${abc}" />');
        expect(setNode.getLineNumber()).toEqual(7);
        expect(setNode.getNumberOfChildren()).toEqual(0);
    });

    it('handles empty "isif" tag', () => {
        const rootNode = getRootNodeFromTemplate(20);
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
        const rootNode = getRootNodeFromTemplate(21);
        const divNode  = rootNode.getChild(0);
        const ifNode   = divNode.getChild(0).getChild(0);

        expect(divNode.getValue()).toEqual('<div <isif condition="${c}"></isif>>');
        expect(divNode.getLineNumber()).toEqual(1);
        expect(divNode.getNumberOfChildren()).toEqual(1);

        expect(ifNode.getValue()).toEqual('\n    <isif condition="${c2}">');
        expect(ifNode.getLineNumber()).toEqual(2);
        expect(ifNode.getNumberOfChildren()).toEqual(0);
    });

    it('identifies HTML comments', () => {
        const rootNode        = getRootNodeFromTemplate(24);
        const htmlCommentNode = rootNode.getChild(0);
        const ifNode          = rootNode.getChild(1).getChild(0);

        expect(htmlCommentNode.getValue()).toEqual('<!-- This is an HTML comment -->');
        expect(htmlCommentNode.getLineNumber()).toEqual(1);
        expect(htmlCommentNode.getNumberOfChildren()).toEqual(0);

        expect(ifNode.getValue()).toEqual('\n<isif condition="${condition}">');
        expect(ifNode.getLineNumber()).toEqual(2);
        expect(ifNode.getNumberOfChildren()).toEqual(1);
    });

    it('identifies a html comment as self-closing tag', () => {
        const rootNode        = getRootNodeFromTemplate(25);
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
        const rootNode = getRootNodeFromTemplate(26);
        const styleTag = rootNode.getChild(4);

        expect(styleTag.getValue()).toEqual('<style type="text/css">');
        expect(styleTag.getLineNumber()).toEqual(5);
        expect(styleTag.getNumberOfChildren()).toEqual(1);
    });

    it('handles conditional HTML comments', () => {
        const rootNode            = getRootNodeFromTemplate(26);
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
        const rootNode = getRootNodeFromTemplate(28);
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
        const rootNode   = getRootNodeFromTemplate(29);
        const scriptNode = rootNode.getChild(0);

        expect(scriptNode.getValue()).toEqual('<script type="text/javascript">');
    });

    it('parses DOCTYPE tag', () => {
        const rootNode   = getRootNodeFromTemplate(30);
        const scriptNode = rootNode.getChild(0);

        expect(scriptNode.getValue()).toEqual('<!DOCTYPE html>');
    });

    it('allows void element if HTML 5 config is not disabled', () => {
        const rootNode = getRootNodeFromTemplate(31);
        const metaNode = rootNode.getChild(0).getChild(0);

        expect(metaNode.getValue()).toEqual('\n    <meta http-equiv="refresh" content="2;url=${pdict.Location}">');
    });

    it('parses content with hardcoded string as first child', () => {
        const rootNode     = getRootNodeFromTemplate(32);
        const divNode      = rootNode.getChild(0);
        const hardcodeNode = divNode.getChild(0);
        const isprintNode  = divNode.getChild(1);

        expect(divNode.getValue()).toEqual('<div class="error_message">');
        expect(divNode.getLineNumber()).toEqual(1);
        expect(divNode.getNumberOfChildren()).toEqual(2);

        expect(hardcodeNode.getValue()).toEqual('\n\na\n    ');
        expect(hardcodeNode.getLineNumber()).toEqual(3);
        expect(hardcodeNode.getNumberOfChildren()).toEqual(0);

        expect(isprintNode.getValue()).toEqual('<isprint value="${Resource.msg(\'reorder.productdiscontinued\',\'reorder\',null)}" />');
        expect(isprintNode.getLineNumber()).toEqual(4);
        expect(isprintNode.getNumberOfChildren()).toEqual(0);
    });

    it('parses custom module with "_" char in its name', () => {
        const rootNode         = getRootNodeFromTemplate(33);
        const customModuleNode = rootNode.getChild(0);

        expect(customModuleNode.getValue()).toEqual('<ismycustom_module p_attribute="${\'value\'}"/>');
    });

    it('allows tags within iscomment tags', () => {
        const rootNode    = getRootNodeFromTemplate(34);
        const commentNode = rootNode.getChild(0);

        expect(commentNode.getValue()).toEqual('<iscomment>');
    });

    it('parses multiline elements', () => {
        const rootNode = getRootNodeFromTemplate(35);
        const spanNode = rootNode.getChild(0).getChild(0);

        expect(spanNode.getValue()).toEqual('\n    <span\n        class="required-indicator">');
    });

    it('allows dynamic elements', () => {
        const rootNode    = getRootNodeFromTemplate(36);
        const dynamicNode = rootNode.getChild(0);

        expect(dynamicNode.getValue()).toEqual('<${pdict.isForm === \'true\' ? \'form\' : \'div\'}>');
    });

    it('allows empty ISML expressions: ${}', () => {
        const rootNode  = getRootNodeFromTemplate(38);
        const issetNode = rootNode.getChild(0).getChild(0);

        expect(issetNode.getValue()).toEqual('\n    <isset name="isLowPrice" value="${}" scope="page" />');
    });

    it('accepts a hardcoded string as first element', () => {
        const rootNode = getRootNodeFromTemplate(27);
        const textNode = rootNode.getChild(0);
        const divNode  = rootNode.getChild(1);

        expect(textNode.getValue()).toEqual('\ntest\n\n');
        expect(textNode.getLineNumber()).toEqual(2);
        expect(textNode.getNumberOfChildren()).toEqual(0);

        expect(divNode.getValue()).toEqual('<td class="value">');
        expect(divNode.getLineNumber()).toEqual(4);
        expect(divNode.getNumberOfChildren()).toEqual(0);
    });
});

const getFilePath = number => {
    return `${Constants.specIsmlTreeTemplateDir}/template_${number}.isml`;
};

const getTreeFromTemplate = number => {
    const filePath  = getFilePath(number);
    return TreeBuilder.build(filePath);
};

const getRootNodeFromTemplate = number => {
    return getTreeFromTemplate(number).rootNode;
};
