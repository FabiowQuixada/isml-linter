const SpecHelper     = require('../../../SpecHelper');
const TreeBuilder    = require('../../../../src/isml_tree/TreeBuilder');
const Constants      = require('../../../../src/Constants');
const ExceptionUtils = require('../../../../src/util/ExceptionUtils');
const ParseStatus    = require('../../../../src/enums/ParseStatus');

const targetObjName   = SpecHelper.getTargetObjName(__filename);
const isCrlfLineBreak = true;

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('creates a tree with non-self-closing tags', () => {
        const rootNode = getRootNodeFromTemplate(0);

        expect(rootNode.children[0].head).toEqual('<div id="root_elem_2">');
    });

    it('creates a tree with a self-closed tag attribute-less grandchild', () => {
        const rootNode = getRootNodeFromTemplate(0);

        expect(rootNode.children[0].children[0].head.trim()).toEqual('<isprint value="some text" />');
    });

    it('creates a tree with a self-closed tag grandchild with attribute', () => {
        const rootNode = getRootNodeFromTemplate(0);

        expect(rootNode.children[0].children[0].head.trim()).toEqual('<isprint value="some text" />');
    });

    it('throws an exception upon invalid isml dom', () => {
        const expectedMessage = ExceptionUtils.unbalancedElementError('div', 2).message;
        const tree            = getTreeFromTemplate(1);

        expect(tree.exception.message).toEqual(expectedMessage);
    });

    it('handles "<" characters in comments', () => {
        const rootNode = getRootNodeFromTemplate(2);

        expect(rootNode.children[0].children[0].head.trim()).toEqual('This comment has a \'<\' character.');
    });

    it('parses <isif> tag with a "<" character in its condition', () => {
        const rootNode = getRootNodeFromTemplate(3);

        expect(rootNode.children[0].children[0].children[0].head).toEqual(`${Constants.EOL}    <div class="clause_1" />`);
    });

    it('recognizes an isml element within a html element', () => {
        const rootNode = getRootNodeFromTemplate(4);

        expect(rootNode.children[0].head).toEqual('<span id="root_elem_17" <isif condition="${active}">class="active"</isif>>');
        expect(rootNode.children[0].children[0].head.trim()).toEqual('Some content');
    });

    it('handles "<" characters in scripts', () => {
        const rootNode = getRootNodeFromTemplate(5);

        expect(rootNode.children[0].children[0].head.trim()).toEqual('var condition = someValue < 4;');
    });

    it('handles "<" characters in isml expressions', () => {
        const rootNode = getRootNodeFromTemplate(6);

        expect(rootNode.children[0].children[0].head.trim()).toEqual('${someValue < 3}');
    });

    it('parses recursive elements', () => {
        const rootNode = getRootNodeFromTemplate(7);

        expect(rootNode.children[0].children[0].head.trim()).toEqual('<div class="inner">');
        expect(rootNode.children[0].children[0].children[0].head.trim()).toEqual('<div class="further_in">');
    });

    it('recognizes an isml expression within an isml/html tag', () => {
        const rootNode = getRootNodeFromTemplate(8);

        expect(rootNode.children[0].children[0].children[0].head).toEqual(`${Constants.EOL}    <isset name="opliID" value="\${opli.ID}" scope="page" />`);
        expect(rootNode.children[0].children[0].children[0].getChildrenQty()).toEqual(0);
    });

    it('recognizes a simple, raw isml expression: ${...}', () => {
        const rootNode = getRootNodeFromTemplate(9);

        expect(rootNode.children[0].children[0].head.trim()).toEqual('${3 < 4}');
    });

    it('creates a one-level-deep tree with node values', () => {
        const rootNode = getRootNodeFromTemplate(10);

        expect(rootNode.children[0].head).toEqual(`<isset name="lineItem" value="\${'some value'}" scope="page" />${Constants.EOL}`);
    });

    it('creates a tree with a self-closed tag grandchild', () => {
        const rootNode = getRootNodeFromTemplate(11);

        expect(rootNode.children[0].children[0].children[0].head.trim()).toEqual('<isif condition="${true}">');
    });

    it('sets the correct depth for container node children', () => {
        const rootNode = getRootNodeFromTemplate(12);

        expect(rootNode.children[0].children[0].children[0].children[0].depth).toEqual(3);
    });

    it('parses nested <isif> tags', () => {
        const rootNode = getRootNodeFromTemplate(13);

        expect(rootNode.children[0].children[0].children[0].children[1].children[0].depth).toEqual(3);
    });

    it('parses hard-coded strings', () => {
        const rootNode = getRootNodeFromTemplate(14);

        expect(rootNode.children[0].head).toEqual('<span>');
        expect(rootNode.children[1].head.trim()).toEqual('A hard-coded string');
        expect(rootNode.children[2].children[0].head.trim()).toEqual('Another hard-coded string');
    });

    it('parses a child "isif" tag', () => {
        const rootNode    = getRootNodeFromTemplate(16);
        const trNode      = rootNode.children[0];
        const commentNode = rootNode.children[1];

        expect(trNode.head).toEqual(`${Constants.EOL}<tr class="cart_row lineItem-\${lineItem.getUUID()} product-\${productLineItem.productID}">`);
        expect(trNode.lineNumber).toEqual(2);
        expect(trNode.getChildrenQty()).toEqual(1);

        expect(commentNode.head).toEqual(`${Constants.EOL}${Constants.EOL}${Constants.EOL}<iscomment>`);
        expect(commentNode.lineNumber).toEqual(23);
        expect(commentNode.depth).toEqual(1);
    });

    it('identifies ISML expressions I', () => {
        const rootNode       = getRootNodeFromTemplate(17);
        const isifNode       = rootNode.children[0].children[0];
        const nestedIsifNode = isifNode.children[0].children[0];

        expect(nestedIsifNode.head).toEqual(`${Constants.EOL}    <isif condition="\${c2}">`);
        expect(nestedIsifNode.lineNumber).toEqual(2);
        expect(nestedIsifNode.getChildrenQty()).toEqual(1);
    });

    it('identifies ISML expressions II', () => {
        const rootNode = getRootNodeFromTemplate(18);
        const divNode  = rootNode.children[2];

        expect(divNode.head).toEqual(`${Constants.EOL}<div class="product-availability">`);
        expect(divNode.lineNumber).toEqual(23);
        expect(divNode.getChildrenQty()).toEqual(1);
    });

    it('identifies ISML expressions III', () => {
        const rootNode  = getRootNodeFromTemplate(19);
        const issetNode = rootNode.children[2];

        expect(issetNode.head).toEqual(`${Constants.EOL}<isset value="\${abc}" />${Constants.EOL}`);
        expect(issetNode.lineNumber).toEqual(7);
        expect(issetNode.getChildrenQty()).toEqual(0);
    });

    it('handles empty "isif" tag', () => {
        const rootNode = getRootNodeFromTemplate(20);
        const divNode  = rootNode.children[0];
        const isifNode = divNode.children[0].children[0];

        expect(divNode.head).toEqual('<div <isif condition="${condition1}"></isif>>');
        expect(divNode.lineNumber).toEqual(1);
        expect(divNode.getChildrenQty()).toEqual(1);

        expect(isifNode.head).toEqual(`${Constants.EOL}    <isif condition="\${condition2}">`);
        expect(isifNode.lineNumber).toEqual(2);
        expect(isifNode.getChildrenQty()).toEqual(0);
    });

    it('handle one-char condition "if" tag', () => {
        const rootNode = getRootNodeFromTemplate(21);
        const divNode  = rootNode.children[0];
        const isifNode = divNode.children[0].children[0];

        expect(divNode.head).toEqual('<div <isif condition="${c}"></isif>>');
        expect(divNode.lineNumber).toEqual(1);
        expect(divNode.getChildrenQty()).toEqual(1);

        expect(isifNode.head).toEqual(`${Constants.EOL}    <isif condition="\${c2}">`);
        expect(isifNode.lineNumber).toEqual(2);
        expect(isifNode.getChildrenQty()).toEqual(0);
    });

    it('allows empty "script" tag', () => {
        const tree       = getTreeFromTemplate(22);
        const rootNode   = tree.rootNode;
        const scriptNode = rootNode.children[0];

        expect(scriptNode.getType()).toEqual('script');
    });

    it('identifies deprecated ISML comments', () => {
        const tree     = getTreeFromTemplate(23);
        const rootNode = tree.rootNode;

        expect(rootNode).not.toEqual(null);
    });

    it('identifies HTML comments', () => {
        const rootNode        = getRootNodeFromTemplate(24);
        const htmlCommentNode = rootNode.children[0];
        const isifNode        = rootNode.children[1].children[0];

        expect(htmlCommentNode.head).toEqual('<!-- This is an HTML comment -->');
        expect(htmlCommentNode.lineNumber).toEqual(1);
        expect(htmlCommentNode.getChildrenQty()).toEqual(0);

        expect(isifNode.head).toEqual(`${Constants.EOL}<isif condition="\${condition}">`);
        expect(isifNode.lineNumber).toEqual(2);
        expect(isifNode.getChildrenQty()).toEqual(1);
    });

    it('identifies a html comment as self-closing tag', () => {
        const rootNode        = getRootNodeFromTemplate(25);
        const htmlCommentNode = rootNode.children[0];
        const mainDivNode     = rootNode.children[1];
        const childDivNode    = mainDivNode.children[0];

        expect(rootNode.getChildrenQty()).toEqual(2);

        expect(htmlCommentNode.head).toEqual(`${Constants.EOL}<!-- make drop down -->`);
        expect(htmlCommentNode.lineNumber).toEqual(2);
        expect(htmlCommentNode.getChildrenQty()).toEqual(0);

        expect(mainDivNode.head).toEqual(`${Constants.EOL}<div class="row">`);
        expect(mainDivNode.lineNumber).toEqual(3);
        expect(mainDivNode.getChildrenQty()).toEqual(1);

        expect(childDivNode.head).toEqual(`${Constants.EOL}    <div class="col-sm-6">`);
        expect(childDivNode.lineNumber).toEqual(4);
        expect(childDivNode.getChildrenQty()).toEqual(0);
    });

    it('identifies style tags', () => {
        const rootNode  = getRootNodeFromTemplate(26);
        const styleNode = rootNode.children[4];

        expect(styleNode.head).toEqual(`${Constants.EOL}<style type="text/css">`);
        expect(styleNode.lineNumber).toEqual(5);
        expect(styleNode.getChildrenQty()).toEqual(1);
    });

    it('handles conditional HTML comments', () => {
        const rootNode               = getRootNodeFromTemplate(26);
        const ConditionalNode        = rootNode.children[1];
        const metaNode               = rootNode.children[2];
        const closingConditionalNode = rootNode.children[3];
        const styleNode              = rootNode.children[4];

        expect(ConditionalNode.head).toEqual(`${Constants.EOL}<!--[if !mso]><!-- -->`);
        expect(ConditionalNode.lineNumber).toEqual(2);
        expect(ConditionalNode.getChildrenQty()).toEqual(0);

        expect(metaNode.head).toEqual(`${Constants.EOL}    <meta content="IE=edge" http-equiv="X-UA-Compatible" />`);
        expect(metaNode.lineNumber).toEqual(3);
        expect(metaNode.getChildrenQty()).toEqual(0);

        expect(closingConditionalNode.head).toEqual(`${Constants.EOL}<!--<![endif]-->`);
        expect(closingConditionalNode.lineNumber).toEqual(4);
        expect(closingConditionalNode.getChildrenQty()).toEqual(0);

        expect(styleNode.head).toEqual(`${Constants.EOL}<style type="text/css">`);
        expect(styleNode.lineNumber).toEqual(5);
        expect(styleNode.getChildrenQty()).toEqual(1);
    });

    it('allows opening "isif" tags with slash: <isif />', () => {
        const rootNode = getRootNodeFromTemplate(28);
        const isifNode = rootNode.children[0].children[0];
        const divNode  = isifNode.children[0];

        expect(isifNode.head).toEqual('<isif condition="${true}"/>');
        expect(isifNode.lineNumber).toEqual(1);
        expect(isifNode.getChildrenQty()).toEqual(1);

        expect(divNode.head).toEqual(`${Constants.EOL}    <div/>`);
        expect(divNode.lineNumber).toEqual(2);
        expect(divNode.getChildrenQty()).toEqual(0);
    });

    it('parses script tag with attributes', () => {
        const rootNode   = getRootNodeFromTemplate(29);
        const scriptNode = rootNode.children[0];

        expect(scriptNode.head).toEqual('<script type="text/javascript">');
    });

    it('parses DOCTYPE tag', () => {
        const rootNode   = getRootNodeFromTemplate(30);
        const scriptNode = rootNode.children[0];

        expect(scriptNode.head).toEqual('<!DOCTYPE html>');
    });

    it('allows void element if HTML 5 config is not disabled', () => {
        const rootNode = getRootNodeFromTemplate(31);
        const metaNode = rootNode.children[0].children[0];

        expect(metaNode.head).toEqual(`${Constants.EOL}    <meta http-equiv="refresh" content="2;url=\${pdict.Location}">`);
    });

    it('parses content with hardcoded string as first child', () => {
        const rootNode     = getRootNodeFromTemplate(32);
        const divNode      = rootNode.children[0];
        const hardcodeNode = divNode.children[0];
        const isprintNode  = divNode.children[1];

        expect(divNode.head).toEqual('<div class="error_message">');
        expect(divNode.lineNumber).toEqual(1);
        expect(divNode.getChildrenQty()).toEqual(2);

        expect(hardcodeNode.head).toEqual(`${Constants.EOL}${Constants.EOL}a`);
        expect(hardcodeNode.lineNumber).toEqual(3);
        expect(hardcodeNode.getChildrenQty()).toEqual(0);

        expect(isprintNode.head).toEqual(`${Constants.EOL}    <isprint value="\${Resource.msg('reorder.productdiscontinued','reorder',null)}" />`);
        expect(isprintNode.lineNumber).toEqual(4);
        expect(isprintNode.getChildrenQty()).toEqual(0);
    });

    it('parses custom module with "_" char in its name', () => {
        const rootNode         = getRootNodeFromTemplate(33);
        const customModuleNode = rootNode.children[0];

        expect(customModuleNode.head).toEqual(`<ismycustom_module p_attribute="\${'value'}"/>${Constants.EOL}`);
    });

    it('allows tags within iscomment tags', () => {
        const rootNode    = getRootNodeFromTemplate(34);
        const commentNode = rootNode.children[0];

        expect(commentNode.head).toEqual('<iscomment>');
    });

    it('parses multiline elements', () => {
        const rootNode = getRootNodeFromTemplate(35);
        const spanNode = rootNode.children[0].children[0];

        expect(spanNode.head).toEqual(`${Constants.EOL}    <span${Constants.EOL}        class="required-indicator">`);
    });

    it('allows dynamic elements', () => {
        const rootNode    = getRootNodeFromTemplate(36);
        const dynamicNode = rootNode.children[0];

        expect(dynamicNode.head).toEqual('<${pdict.isForm === \'true\' ? \'form\' : \'div\'}>');
    });

    it('allows empty ISML expressions: ${}', () => {
        const rootNode  = getRootNodeFromTemplate(38);
        const issetNode = rootNode.children[0].children[0];

        expect(issetNode.head).toEqual(`${Constants.EOL}    <isset name="isLowPrice" value="\${}" scope="page" />`);
    });

    it('accepts a hardcoded string as last element', () => {
        const rootNode = getRootNodeFromTemplate(37);
        const tdNode   = rootNode.children[0];
        const textNode = rootNode.children[1];

        expect(tdNode.head).toEqual('<td class="value">');
        expect(tdNode.lineNumber).toEqual(1);
        expect(tdNode.getChildrenQty()).toEqual(0);

        expect(textNode.head).toEqual(`${Constants.EOL}${Constants.EOL}test${Constants.EOL}`);
        expect(textNode.lineNumber).toEqual(5);
        expect(textNode.getChildrenQty()).toEqual(0);
    });

    it('accepts a hardcoded string as first element', () => {
        const rootNode = getRootNodeFromTemplate(27);
        const textNode = rootNode.children[0];
        const divNode  = rootNode.children[1];

        expect(textNode.head).toEqual(`${Constants.EOL}test${Constants.EOL}${Constants.EOL}`);
        expect(textNode.lineNumber).toEqual(2);
        expect(textNode.getChildrenQty()).toEqual(0);

        expect(divNode.head).toEqual('<td class="value">');
        expect(divNode.lineNumber).toEqual(4);
        expect(divNode.getChildrenQty()).toEqual(0);
    });

    it('calculates node tail global position', () => {
        const rootNode = getRootNodeFromTemplate(40);
        const a1Node   = rootNode.children[0];
        const a2Node   = a1Node.children[0];
        const a3Node   = a2Node.children[0];
        const a4Node   = a3Node.children[0];

        expect(a1Node.tail).toEqual(`${Constants.EOL}</a1>${Constants.EOL}`);
        expect(a1Node.tailGlobalPos).toEqual(47);

        expect(a2Node.tail).toEqual(`${Constants.EOL}</a2>`);
        expect(a2Node.tailGlobalPos).toEqual(40);

        expect(a3Node.tail).toEqual(`${Constants.EOL}</a3>`);
        expect(a3Node.tailGlobalPos).toEqual(33);

        expect(a4Node.tail).toEqual(`${Constants.EOL}${Constants.EOL}</a4>`);
        expect(a4Node.tailGlobalPos).toEqual(26);
    });

    it('calculates node tail line number', () => {
        const rootNode = getRootNodeFromTemplate(41);
        const a1Node   = rootNode.children[0];
        const a2Node   = a1Node.children[0];
        const a3Node   = a2Node.children[0];
        const a4Node   = a3Node.children[0];

        expect(a1Node.tail).toEqual(`${Constants.EOL}</a1>${Constants.EOL}`);
        expect(a1Node.tailLineNumber).toEqual(13);

        expect(a2Node.tail).toEqual(`${Constants.EOL}${Constants.EOL}</a2>`);
        expect(a2Node.tailLineNumber).toEqual(12);

        expect(a3Node.tail).toEqual(`${Constants.EOL}</a3>`);
        expect(a3Node.tailLineNumber).toEqual(10);

        expect(a4Node.tail).toEqual(`${Constants.EOL}${Constants.EOL}${Constants.EOL}${Constants.EOL}</a4>`);
        expect(a4Node.tailLineNumber).toEqual(9);
    });

    it('detects an "<" invalid character', () => {
        const tree = getTreeFromTemplate(42);

        expect(tree.exception.message    ).toEqual('Invalid character "<" found');
        expect(tree.exception.globalPos  ).toEqual(46);
        expect(tree.exception.length     ).toEqual(1);
        expect(tree.exception.lineNumber ).toEqual(3);
    });

    it('sets the tail of a dynamic node correctly', () => {
        const rootNode    = getRootNodeFromTemplate(43);
        const dynamicNode = rootNode.children[0];

        expect(dynamicNode.tail).toEqual(Constants.EOL + '</${pdict.isForm === \'true\' ? \'form\' : \'div\'}>' + Constants.EOL);
    });

    it('ignores opening comment strings within comments', () => {
        const rootNode     = getRootNodeFromTemplate(44);
        const headNode     = rootNode.children[0];
        const htmlComment0 = headNode.children[0];
        const htmlComment1 = headNode.children[1];

        expect(headNode.head).toEqual('<head>');
        expect(htmlComment0.head).toEqual(`${Constants.EOL}    <!--[if gt IE 9]><!-->`);
        expect(htmlComment1.head).toEqual(`${Constants.EOL}    <!--<![endif]-->`);
    });

    it('allows an HTML element as first child of a parent node', () => {
        const rootNode     = getRootNodeFromTemplate(45);
        const spanNode     = rootNode.children[0];
        const htmlComment0 = spanNode.children[0];
        const divNode      = rootNode.children[1];
        const htmlComment1 = divNode.children[0];

        expect(htmlComment0.head).toEqual(`${Constants.EOL}    <!-- Comment 1 -->`);
        expect(htmlComment1.head).toEqual(`${Constants.EOL}    <!-- Comment 2 -->`);
    });

    it('allows an ISML expression within HTML comment', () => {
        const rootNode    = getRootNodeFromTemplate(46);
        const commentNode = rootNode.children[0];

        expect(commentNode.head).toEqual(`${Constants.EOL}<!-- dw="\${value}" -->${Constants.EOL}`);
    });

    it('allows unclosed <isprint> tag', () => {
        const rootNode    = getRootNodeFromTemplate(47);
        const isprintNode = rootNode.children[0].children[0];

        expect(isprintNode.head).toEqual(`${Constants.EOL}    <isprint value="\${pdict.response[pdict.serviceReply]['reasonCode']}">`);
    });

    it('allows unclosed <iscontent> tag', () => {
        const rootNode      = getRootNodeFromTemplate(48);
        const iscontentNode = rootNode.children[0];

        expect(iscontentNode.head).toEqual('<iscontent type="text/html" charset="UTF-8">');
    });

    it('allows slashy <isif> tags: <isif condition="${...}" />', () => {
        const rootNode      = getRootNodeFromTemplate(49);
        const iscontentNode = rootNode.children[0];

        expect(iscontentNode.head).toEqual('<div>');
    });

    it('identifies missing closing char', () => {
        const tree = getTreeFromTemplate(50);

        expect(tree.exception.type       ).toEqual(ExceptionUtils.types.INVALID_CHARACTER);
        expect(tree.exception.globalPos  ).toEqual(74);
        expect(tree.exception.length     ).toEqual(1);
        expect(tree.exception.lineNumber ).toEqual(5);
    });

    it('identifies missing closing char II', () => {
        const tree = getTreeFromTemplate(51);

        expect(tree.exception.type       ).toEqual(ExceptionUtils.types.INVALID_CHARACTER);
        expect(tree.exception.globalPos  ).toEqual(101);
        expect(tree.exception.length     ).toEqual(1);
        expect(tree.exception.lineNumber ).toEqual(5);
    });

    it('ensures deprecated ISML comments are correctly closed I', () => {
        const tree = getTreeFromTemplate(52);

        expect(tree.exception.type       ).toEqual(ExceptionUtils.types.UNCLOSED_DEPRECATED_ISML_COMMENT);
        expect(tree.exception.globalPos  ).toEqual(10);
        expect(tree.exception.length     ).toEqual(24);
        expect(tree.exception.lineNumber ).toEqual(2);
    });

    it('ensures deprecated ISML comments are correctly closed II', () => {
        const tree = getTreeFromTemplate(53);

        expect(tree.exception.type       ).toEqual(ExceptionUtils.types.UNCLOSED_DEPRECATED_ISML_COMMENT);
        expect(tree.exception.globalPos  ).toEqual(47);
        expect(tree.exception.length     ).toEqual(24);
        expect(tree.exception.lineNumber ).toEqual(5);
    });

    it('parses correctly element that has a hardcode element as first child', () => {
        const tree  = getTreeFromTemplate(54);
        const pNode = tree.rootNode.children[0];

        expect(pNode.children.length).toEqual(2);
    });

    it('allows custom tags to not self-close', () => {
        const tree = getTreeFromTemplate(55);

        expect(tree.rootNode).not.toEqual(null);
    });

    it('builds tree with nested elements that have the same value as a descendant', () => {
        const tree     = getTreeFromTemplate(56);
        const rootNode = tree.rootNode;

        expect(rootNode).not.toEqual(null);
    });

    it('identifies two different children if text is followed by expression', () => {
        const tree    = getTreeFromTemplate(57);
        const divNode = tree.rootNode.children[0];

        expect(divNode.children.length).toEqual(2);
    });

    it('identifies two different children if text is followed by expression II', () => {
        const tree     = getTreeFromTemplate(58);
        const divNode  = tree.rootNode.children[1];
        const textNode = divNode.children[1];
        const expNode  = divNode.children[2];

        expect(divNode.children.length).toEqual(4);
        expect(textNode.lineNumber).toEqual(5);
        expect(expNode.lineNumber).toEqual(5);
    });

    it('identifies two different children if text is followed by expression III', () => {
        const tree     = getTreeFromTemplate(59);
        const divNode  = tree.rootNode.children[1];
        const textNode = divNode.children[1];
        const expNode  = divNode.children[2];

        expect(divNode.children.length).toEqual(4);
        expect(textNode.lineNumber).toEqual(5);
        expect(expNode.lineNumber).toEqual(6);
    });

    it('identifies a "<" character within an non-embedded expression', () => {
        const rootNode = getRootNodeFromTemplate(60);
        const expNode  = rootNode.children[0];

        expect(expNode.head).toEqual('\n    ${someValue < 3}\n');
    });

    it('identifies children correctly if first is an expression', () => {
        const rootNode = getRootNodeFromTemplate(61);
        const divNode  = rootNode.children[0];
        const expNode  = divNode.children[0];
        const brNode   = divNode.children[1];

        expect(divNode.children.length).toEqual(2);
        expect(expNode.lineNumber).toEqual(2);
        expect(brNode.lineNumber).toEqual(2);
    });

    it('interprets a tag inside an <iscomment> tag as plain text', () => {
        const rootNode      = getRootNodeFromTemplate(62);
        const iscommentNode = rootNode.children[0];
        const textNode      = iscommentNode.children[0];

        expect(textNode.head).toEqual(' <isif condition="${aCondition}">');
        expect(textNode.getType()).toEqual('text');
    });

    it('identifies <!DOCTYPE> tags as self-closing', () => {
        const rootNode    = getRootNodeFromTemplate(63);
        const docTypeNode = rootNode.children[0];
        const divNode     = rootNode.children[1];

        expect(rootNode.children.length).toEqual(2);
        expect(docTypeNode.isDocType() ) .toEqual(true);
        expect(docTypeNode.head        ).toEqual('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">');
        expect(divNode.head            ).toEqual(`${Constants.EOL}<div>`);
    });

    it('sets node column number', () => {
        const rootNode   = getRootNodeFromTemplate(64);
        const selectNode = rootNode.children[0];

        expect(selectNode.columnNumber).toEqual(9);
        expect(selectNode.tailColumnNumber).toEqual(11);
    });

    it('sets node column number II', () => {
        const rootNode = getRootNodeFromTemplate(65);
        const divNode  = rootNode.children[0];
        const brNode   = divNode.children[0];

        expect(divNode.columnNumber).toEqual(1);
        expect(brNode.columnNumber).toEqual(4);
    });

    it('sets node column number III', () => {
        const rootNode = getRootNodeFromTemplate(66);
        const aNode    = rootNode.children[0];

        expect(aNode.columnNumber).toEqual(1);
    });

    it('allows es6 fat arrows within a "script" tag', () => {
        const rootNode   = getRootNodeFromTemplate(67);
        const scriptNode = rootNode.children[1];

        expect(scriptNode.getType()).toEqual('script');
    });

    it('keeps indentation of an "isif" tag after a hardcode string', () => {
        const rootNode = getRootNodeFromTemplate(68);
        const isifNode = rootNode.children[0].children[2].children[0];

        expect(isifNode.head).toEqual('    <isif condition="${aCondition}">');
    });

    it('allows "script" tag to have attributes', () => {
        const rootNode = getRootNodeFromTemplate(69);

        expect(rootNode).not.toEqual(null);
    });

    it('identifies unbalanced element', () => {
        const tree = getTreeFromTemplate(70);

        expect(tree.exception.type       ).toEqual(ExceptionUtils.types.INVALID_TEMPLATE);
        expect(tree.exception.message    ).toEqual('Unbalanced <div> element');
        expect(tree.exception.globalPos  ).toEqual(53);
        expect(tree.exception.length     ).toEqual(5);
        expect(tree.exception.lineNumber ).toEqual(3);
    });

    it('identifies unbalanced element II', () => {
        const tree = getTreeFromTemplate(71);

        expect(tree.exception.type       ).toEqual(ExceptionUtils.types.INVALID_TEMPLATE);
        expect(tree.exception.message    ).toEqual('Unbalanced <IScustomtag> element');
        expect(tree.exception.globalPos  ).toEqual(44);
        expect(tree.exception.length     ).toEqual(49);
        expect(tree.exception.lineNumber ).toEqual(3);
    });

    it('identifies unbalanced element III', () => {
        const tree = getTreeFromTemplate(72);

        expect(tree.rootNode).not.toEqual(null);
    });

    it('identifies unbalanced element IV', () => {
        const tree = getTreeFromTemplate(73);

        expect(tree.exception.message).toEqual('Unexpected </iselseif> element');
        expect(tree.exception.globalPos  ).toEqual(97);
        expect(tree.exception.length     ).toEqual(11);
        expect(tree.exception.lineNumber ).toEqual(5);
    });

    it('detects an "<" invalid character II', () => {
        const tree = getTreeFromTemplate(74);

        expect(tree.exception.message    ).toEqual('Invalid character "<" found');
        expect(tree.exception.globalPos  ).toEqual(94);
        expect(tree.exception.length     ).toEqual(1);
        expect(tree.exception.lineNumber ).toEqual(6);
    });

    it('ignores content from "isscript" tag', () => {
        const tree = getTreeFromTemplate(75);

        expect(tree.rootNode).not.toEqual(null);
    });

    it('ignores content from "isscript" tag II', () => {
        const tree = getTreeFromTemplate(76);

        expect(tree.rootNode).not.toEqual(null);
    });

    it('allows custom tags to be non-self-closing', () => {
        const tree = getTreeFromTemplate(77);

        expect(tree.rootNode).not.toEqual(null);
    });

    it('throws "unbalanced quotes" exception if issue occurs within a node head', () => {
        const tree = getTreeFromTemplate(78);

        expect(tree.exception.message    ).toEqual('Unbalanced quotes in <i> element');
        expect(tree.exception.globalPos  ).toEqual(11);
        expect(tree.exception.length     ).toEqual(38);
        expect(tree.exception.lineNumber ).toEqual(2);
    });

    it('identifies second child of a node when first child is a hardcoded text', () => {
        const rootNode = getRootNodeFromTemplate(79);
        const divNode  = rootNode.children[0];

        expect(divNode.children.length      ).toEqual(3);
        expect(divNode.children[0].getType()).toEqual('text');
        expect(divNode.children[1].getType()).toEqual('container');
        expect(divNode.children[2].getType()).toEqual('text');
    });

    it('correctly parses children of a node if the first child is a hardcode text', () => {
        const rootNode      = getRootNodeFromTemplate(80);
        const divNode       = rootNode.children[0];
        const hardcode1Node = divNode.children[0];
        const spanNode      = divNode.children[1];
        const pNode         = divNode.children[2];
        const hardcode2Node = divNode.children[3];
        const hardcode3Node = spanNode.children[0];
        const hardcode4Node = pNode.children[0];

        expect(divNode.head       ).toEqual('<div>');
        expect(hardcode1Node.head ).toEqual(Constants.EOL + '    style="');
        expect(spanNode.head      ).toEqual(Constants.EOL + '    <span>');
        expect(pNode.head         ).toEqual(Constants.EOL + '    <p>');
        expect(hardcode2Node.head ).toEqual(Constants.EOL + '    "');
        expect(hardcode3Node.head ).toEqual(Constants.EOL + '        Text 1');
        expect(hardcode4Node.head ).toEqual(Constants.EOL + '        Text 2');

        expect(divNode.children.length  ).toEqual(4);
        expect(spanNode.children.length ).toEqual(1);
        expect(pNode.children.length    ).toEqual(1);
    });

    it('ignores any tag defined in a string within an "isscript" tag', () => {
        const rootNode     = getRootNodeFromTemplate(81);
        const isscriptNode = rootNode.children[0];

        expect(isscriptNode.getType()       ).toEqual('isscript');
        expect(isscriptNode.getChildrenQty()).toEqual(1);
    });

    it('allows "condition" attribute to be in a different line from "isif" tag type', () => {
        const rootNode = getRootNodeFromTemplate(82);
        const isifNode = rootNode.children[0].children[0];

        expect(isifNode.getType()       ).toEqual('isif');
        expect(isifNode.getChildrenQty()).toEqual(1);
    });

    it('identifies invalid nested "isif" element', () => {
        const tree = getTreeFromTemplate(83);

        expect(tree.status).toEqual(ParseStatus.INVALID_DOM);
        expect(tree.exception.type).toEqual(ExceptionUtils.types.INVALID_NESTED_ISIF);
        expect(tree.exception.message).toEqual('An error occurred while parsing element "<button>" in line 2. Try moving the closing character ">" of the "<button>" element to outside of the "<isif>" condition.');
    });
});

const getTemplatePath = number => {
    return SpecHelper.getTemplatePath(Constants.specIsmlTreeTemplateDir, number);
};

const getTreeFromTemplate = number => {
    const templatePath  = getTemplatePath(number);
    return TreeBuilder.build(templatePath, undefined, isCrlfLineBreak);
};

const getRootNodeFromTemplate = number => {
    const tree = getTreeFromTemplate(number);
    return tree.rootNode;
};
