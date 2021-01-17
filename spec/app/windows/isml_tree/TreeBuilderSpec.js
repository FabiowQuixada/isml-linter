const SpecHelper     = require('../../../SpecHelper');
const TreeBuilder    = require('../../../../src/isml_tree/TreeBuilder');
const Constants      = require('../../../../src/Constants');
const ExceptionUtils = require('../../../../src/util/ExceptionUtils');

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

        expect(rootNode.children[0].value).toEqual('<div id="root_elem_2">');
    });

    it('creates a tree with a self-closed tag attribute-less grandchild', () => {
        const rootNode = getRootNodeFromTemplate(0);

        expect(rootNode.children[0].children[0].value.trim()).toEqual('<isprint value="some text" />');
    });

    it('creates a tree with a self-closed tag grandchild with attribute', () => {
        const rootNode = getRootNodeFromTemplate(0);

        expect(rootNode.children[0].children[0].value.trim()).toEqual('<isprint value="some text" />');
    });

    it('throws an exception upon invalid isml dom', () => {
        const expectedMessage = ExceptionUtils.unbalancedElementError('div', 2).message;
        const tree            = getTreeFromTemplate(1);

        expect(tree.exception.message).toEqual(expectedMessage);
    });

    it('handles "<" characters in comments', () => {
        const rootNode = getRootNodeFromTemplate(2);

        expect(rootNode.children[0].children[0].value.trim()).toEqual('This comment has a \'<\' character.');
    });

    it('parses <isif> tag with a "<" character in its condition', () => {
        const rootNode = getRootNodeFromTemplate(3);

        expect(rootNode.children[0].children[0].children[0].value).toEqual(`${Constants.EOL}    <div class="clause_1" />`);
    });

    it('recognizes an isml element within a html element', () => {
        const rootNode = getRootNodeFromTemplate(4);

        expect(rootNode.children[0].value).toEqual('<span id="root_elem_17" <isif condition="${active}">class="active"</isif>>');
        expect(rootNode.children[0].children[0].value.trim()).toEqual('Some content');
    });

    it('handles "<" characters in scripts', () => {
        const rootNode = getRootNodeFromTemplate(5);

        expect(rootNode.children[0].children[0].value.trim()).toEqual('var condition = someValue < 4;');
    });

    it('handles "<" characters in isml expressions', () => {
        const rootNode = getRootNodeFromTemplate(6);

        expect(rootNode.children[0].children[0].value.trim()).toEqual('${someValue < 3}');
    });

    it('parses recursive elements', () => {
        const rootNode = getRootNodeFromTemplate(7);

        expect(rootNode.children[0].children[0].value.trim()).toEqual('<div class="inner">');
        expect(rootNode.children[0].children[0].children[0].value.trim()).toEqual('<div class="further_in">');
    });

    it('recognizes an isml expression within an isml/html tag', () => {
        const rootNode = getRootNodeFromTemplate(8);

        expect(rootNode.children[0].children[0].children[0].value).toEqual(`${Constants.EOL}    <isset name="opliID" value="\${opli.ID}" scope="page" />`);
        expect(rootNode.children[0].children[0].children[0].getNumberOfChildren()).toEqual(0);
    });

    it('recognizes a simple, raw isml expression: ${...}', () => {
        const rootNode = getRootNodeFromTemplate(9);

        expect(rootNode.children[0].children[0].value.trim()).toEqual('${3 < 4}');
    });

    it('creates a one-level-deep tree with node values', () => {
        const rootNode = getRootNodeFromTemplate(10);

        expect(rootNode.children[0].value).toEqual(`<isset name="lineItem" value="\${'some value'}" scope="page" />${Constants.EOL}`);
    });

    it('creates a tree with a self-closed tag grandchild', () => {
        const rootNode = getRootNodeFromTemplate(11);

        expect(rootNode.children[0].children[0].children[0].value.trim()).toEqual('<isif condition="${true}">');
    });

    it('sets the correct depth fo multi-clause children', () => {
        const rootNode = getRootNodeFromTemplate(12);

        expect(rootNode.children[0].children[0].children[0].children[0].depth).toEqual(3);
    });

    it('parses nested <isif> tags', () => {
        const rootNode = getRootNodeFromTemplate(13);

        expect(rootNode.children[0].children[0].children[0].children[1].children[0].depth).toEqual(3);
    });

    it('parses hard-coded strings', () => {
        const rootNode = getRootNodeFromTemplate(14);

        expect(rootNode.children[0].value).toEqual('<span>');
        expect(rootNode.children[1].value.trim()).toEqual('A hard-coded string');
        expect(rootNode.children[2].children[0].value.trim()).toEqual('Another hard-coded string');
    });

    it('parses a child "isif" tag', () => {
        const rootNode    = getRootNodeFromTemplate(16);
        const trNode      = rootNode.children[0];
        const commentNode = rootNode.children[1];

        expect(trNode.value).toEqual(`${Constants.EOL}<tr class="cart_row lineItem-\${lineItem.getUUID()} product-\${productLineItem.productID}">`);
        expect(trNode.lineNumber).toEqual(2);
        expect(trNode.getNumberOfChildren()).toEqual(1);

        expect(commentNode.value).toEqual(`${Constants.EOL}${Constants.EOL}${Constants.EOL}<iscomment>`);
        expect(commentNode.lineNumber).toEqual(23);
        expect(commentNode.depth).toEqual(1);
    });

    it('identifies ISML expressions I', () => {
        const rootNode     = getRootNodeFromTemplate(17);
        const ifNode       = rootNode.children[0].children[0];
        const nestedIfNode = ifNode.children[0].children[0];

        expect(nestedIfNode.value).toEqual(`${Constants.EOL}    <isif condition="\${c2}">`);
        expect(nestedIfNode.lineNumber).toEqual(2);
        expect(nestedIfNode.getNumberOfChildren()).toEqual(1);
    });

    it('identifies ISML expressions II', () => {
        const rootNode  = getRootNodeFromTemplate(18);
        const availNode = rootNode.children[2];

        expect(availNode.value).toEqual(`${Constants.EOL}<div class="product-availability">`);
        expect(availNode.lineNumber).toEqual(23);
        expect(availNode.getNumberOfChildren()).toEqual(1);
    });

    it('identifies ISML expressions III', () => {
        const rootNode = getRootNodeFromTemplate(19);
        const setNode  = rootNode.children[2];

        expect(setNode.value).toEqual(`${Constants.EOL}<isset value="\${abc}" />${Constants.EOL}`);
        expect(setNode.lineNumber).toEqual(7);
        expect(setNode.getNumberOfChildren()).toEqual(0);
    });

    it('handles empty "isif" tag', () => {
        const rootNode = getRootNodeFromTemplate(20);
        const divNode  = rootNode.children[0];
        const ifNode   = divNode.children[0].children[0];

        expect(divNode.value).toEqual('<div <isif condition="${condition1}"></isif>>');
        expect(divNode.lineNumber).toEqual(1);
        expect(divNode.getNumberOfChildren()).toEqual(1);

        expect(ifNode.value).toEqual(`${Constants.EOL}    <isif condition="\${condition2}">`);
        expect(ifNode.lineNumber).toEqual(2);
        expect(ifNode.getNumberOfChildren()).toEqual(0);
    });

    it('handle one-char condition "if" tag', () => {
        const rootNode = getRootNodeFromTemplate(21);
        const divNode  = rootNode.children[0];
        const ifNode   = divNode.children[0].children[0];

        expect(divNode.value).toEqual('<div <isif condition="${c}"></isif>>');
        expect(divNode.lineNumber).toEqual(1);
        expect(divNode.getNumberOfChildren()).toEqual(1);

        expect(ifNode.value).toEqual(`${Constants.EOL}    <isif condition="\${c2}">`);
        expect(ifNode.lineNumber).toEqual(2);
        expect(ifNode.getNumberOfChildren()).toEqual(0);
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
        const ifNode          = rootNode.children[1].children[0];

        expect(htmlCommentNode.value).toEqual('<!-- This is an HTML comment -->');
        expect(htmlCommentNode.lineNumber).toEqual(1);
        expect(htmlCommentNode.getNumberOfChildren()).toEqual(0);

        expect(ifNode.value).toEqual(`${Constants.EOL}<isif condition="\${condition}">`);
        expect(ifNode.lineNumber).toEqual(2);
        expect(ifNode.getNumberOfChildren()).toEqual(1);
    });

    it('identifies a html comment as self-closing tag', () => {
        const rootNode        = getRootNodeFromTemplate(25);
        const htmlCommentNode = rootNode.children[0];
        const mainDivNode     = rootNode.children[1];
        const childDivNode    = mainDivNode.children[0];

        expect(rootNode.getNumberOfChildren()).toEqual(2);

        expect(htmlCommentNode.value).toEqual(`${Constants.EOL}<!-- make drop down -->`);
        expect(htmlCommentNode.lineNumber).toEqual(2);
        expect(htmlCommentNode.getNumberOfChildren()).toEqual(0);

        expect(mainDivNode.value).toEqual(`${Constants.EOL}<div class="row">`);
        expect(mainDivNode.lineNumber).toEqual(3);
        expect(mainDivNode.getNumberOfChildren()).toEqual(1);

        expect(childDivNode.value).toEqual(`${Constants.EOL}    <div class="col-sm-6">`);
        expect(childDivNode.lineNumber).toEqual(4);
        expect(childDivNode.getNumberOfChildren()).toEqual(0);
    });

    it('identifies style tags', () => {
        const rootNode = getRootNodeFromTemplate(26);
        const styleTag = rootNode.children[4];

        expect(styleTag.value).toEqual(`${Constants.EOL}<style type="text/css">`);
        expect(styleTag.lineNumber).toEqual(5);
        expect(styleTag.getNumberOfChildren()).toEqual(1);
    });

    it('handles conditional HTML comments', () => {
        const rootNode            = getRootNodeFromTemplate(26);
        const conditionTag        = rootNode.children[1];
        const metaTag             = rootNode.children[2];
        const closingConditionTag = rootNode.children[3];
        const afterTag            = rootNode.children[4];

        expect(conditionTag.value).toEqual(`${Constants.EOL}<!--[if !mso]><!-- -->`);
        expect(conditionTag.lineNumber).toEqual(2);
        expect(conditionTag.getNumberOfChildren()).toEqual(0);

        expect(metaTag.value).toEqual(`${Constants.EOL}    <meta content="IE=edge" http-equiv="X-UA-Compatible" />`);
        expect(metaTag.lineNumber).toEqual(3);
        expect(metaTag.getNumberOfChildren()).toEqual(0);

        expect(closingConditionTag.value).toEqual(`${Constants.EOL}<!--<![endif]-->`);
        expect(closingConditionTag.lineNumber).toEqual(4);
        expect(closingConditionTag.getNumberOfChildren()).toEqual(0);

        expect(afterTag.value).toEqual(`${Constants.EOL}<style type="text/css">`);
        expect(afterTag.lineNumber).toEqual(5);
        expect(afterTag.getNumberOfChildren()).toEqual(1);
    });

    it('allows opening "isif" tags with slash: <isif />', () => {
        const rootNode = getRootNodeFromTemplate(28);
        const isifNode = rootNode.children[0].children[0];
        const divNode  = isifNode.children[0];

        expect(isifNode.value).toEqual('<isif condition="${true}"/>');
        expect(isifNode.lineNumber).toEqual(1);
        expect(isifNode.getNumberOfChildren()).toEqual(1);

        expect(divNode.value).toEqual(`${Constants.EOL}    <div/>`);
        expect(divNode.lineNumber).toEqual(2);
        expect(divNode.getNumberOfChildren()).toEqual(0);
    });

    it('parses script tag with attributes', () => {
        const rootNode   = getRootNodeFromTemplate(29);
        const scriptNode = rootNode.children[0];

        expect(scriptNode.value).toEqual('<script type="text/javascript">');
    });

    it('parses DOCTYPE tag', () => {
        const rootNode   = getRootNodeFromTemplate(30);
        const scriptNode = rootNode.children[0];

        expect(scriptNode.value).toEqual('<!DOCTYPE html>');
    });

    it('allows void element if HTML 5 config is not disabled', () => {
        const rootNode = getRootNodeFromTemplate(31);
        const metaNode = rootNode.children[0].children[0];

        expect(metaNode.value).toEqual(`${Constants.EOL}    <meta http-equiv="refresh" content="2;url=\${pdict.Location}">`);
    });

    it('parses content with hardcoded string as first child', () => {
        const rootNode     = getRootNodeFromTemplate(32);
        const divNode      = rootNode.children[0];
        const hardcodeNode = divNode.children[0];
        const isprintNode  = divNode.children[1];

        expect(divNode.value).toEqual('<div class="error_message">');
        expect(divNode.lineNumber).toEqual(1);
        expect(divNode.getNumberOfChildren()).toEqual(2);

        expect(hardcodeNode.value).toEqual(`${Constants.EOL}${Constants.EOL}a`);
        expect(hardcodeNode.lineNumber).toEqual(3);
        expect(hardcodeNode.getNumberOfChildren()).toEqual(0);

        expect(isprintNode.value).toEqual(`${Constants.EOL}    <isprint value="\${Resource.msg('reorder.productdiscontinued','reorder',null)}" />`);
        expect(isprintNode.lineNumber).toEqual(4);
        expect(isprintNode.getNumberOfChildren()).toEqual(0);
    });

    it('parses custom module with "_" char in its name', () => {
        const rootNode         = getRootNodeFromTemplate(33);
        const customModuleNode = rootNode.children[0];

        expect(customModuleNode.value).toEqual(`<ismycustom_module p_attribute="\${'value'}"/>${Constants.EOL}`);
    });

    it('allows tags within iscomment tags', () => {
        const rootNode    = getRootNodeFromTemplate(34);
        const commentNode = rootNode.children[0];

        expect(commentNode.value).toEqual('<iscomment>');
    });

    it('parses multiline elements', () => {
        const rootNode = getRootNodeFromTemplate(35);
        const spanNode = rootNode.children[0].children[0];

        expect(spanNode.value).toEqual(`${Constants.EOL}    <span${Constants.EOL}        class="required-indicator">`);
    });

    it('allows dynamic elements', () => {
        const rootNode    = getRootNodeFromTemplate(36);
        const dynamicNode = rootNode.children[0];

        expect(dynamicNode.value).toEqual('<${pdict.isForm === \'true\' ? \'form\' : \'div\'}>');
    });

    it('allows empty ISML expressions: ${}', () => {
        const rootNode  = getRootNodeFromTemplate(38);
        const issetNode = rootNode.children[0].children[0];

        expect(issetNode.value).toEqual(`${Constants.EOL}    <isset name="isLowPrice" value="\${}" scope="page" />`);
    });

    it('accepts a hardcoded string as last element', () => {
        const rootNode = getRootNodeFromTemplate(37);
        const tdNode   = rootNode.children[0];
        const textNode = rootNode.children[1];

        expect(tdNode.value).toEqual('<td class="value">');
        expect(tdNode.lineNumber).toEqual(1);
        expect(tdNode.getNumberOfChildren()).toEqual(0);

        expect(textNode.value).toEqual(`${Constants.EOL}${Constants.EOL}test${Constants.EOL}`);
        expect(textNode.lineNumber).toEqual(5);
        expect(textNode.getNumberOfChildren()).toEqual(0);
    });

    it('accepts a hardcoded string as first element', () => {
        const rootNode = getRootNodeFromTemplate(27);
        const textNode = rootNode.children[0];
        const divNode  = rootNode.children[1];

        expect(textNode.value).toEqual(`${Constants.EOL}test${Constants.EOL}${Constants.EOL}`);
        expect(textNode.lineNumber).toEqual(2);
        expect(textNode.getNumberOfChildren()).toEqual(0);

        expect(divNode.value).toEqual('<td class="value">');
        expect(divNode.lineNumber).toEqual(4);
        expect(divNode.getNumberOfChildren()).toEqual(0);
    });

    it('calculates node suffix global position', () => {
        const rootNode = getRootNodeFromTemplate(40);
        const a1Node   = rootNode.children[0];
        const a2Node   = a1Node.children[0];
        const a3Node   = a2Node.children[0];
        const a4Node   = a3Node.children[0];

        expect(a1Node.suffixValue).toEqual(`${Constants.EOL}</a1>${Constants.EOL}`);
        expect(a1Node.suffixGlobalPos).toEqual(47);

        expect(a2Node.suffixValue).toEqual(`${Constants.EOL}</a2>`);
        expect(a2Node.suffixGlobalPos).toEqual(40);

        expect(a3Node.suffixValue).toEqual(`${Constants.EOL}</a3>`);
        expect(a3Node.suffixGlobalPos).toEqual(33);

        expect(a4Node.suffixValue).toEqual(`${Constants.EOL}${Constants.EOL}</a4>`);
        expect(a4Node.suffixGlobalPos).toEqual(26);
    });

    it('calculates node suffix line number', () => {
        const rootNode = getRootNodeFromTemplate(41);
        const a1Node   = rootNode.children[0];
        const a2Node   = a1Node.children[0];
        const a3Node   = a2Node.children[0];
        const a4Node   = a3Node.children[0];

        expect(a1Node.suffixValue).toEqual(`${Constants.EOL}</a1>${Constants.EOL}`);
        expect(a1Node.suffixLineNumber).toEqual(13);

        expect(a2Node.suffixValue).toEqual(`${Constants.EOL}${Constants.EOL}</a2>`);
        expect(a2Node.suffixLineNumber).toEqual(12);

        expect(a3Node.suffixValue).toEqual(`${Constants.EOL}</a3>`);
        expect(a3Node.suffixLineNumber).toEqual(10);

        expect(a4Node.suffixValue).toEqual(`${Constants.EOL}${Constants.EOL}${Constants.EOL}${Constants.EOL}</a4>`);
        expect(a4Node.suffixLineNumber).toEqual(9);
    });

    it('detects an "<" invalid character', () => {
        const tree         = getTreeFromTemplate(42);
        const templatePath = getTemplatePath(42);

        expect(tree.exception.message    ).toEqual(`Invalid character "<" found at ${templatePath}:3.`);
        expect(tree.exception.globalPos  ).toEqual(46);
        expect(tree.exception.length     ).toEqual(1);
        expect(tree.exception.lineNumber ).toEqual(3);
    });

    it('sets the suffix of a dynamic node correctly', () => {
        const rootNode    = getRootNodeFromTemplate(43);
        const dynamicNode = rootNode.children[0];

        expect(dynamicNode.suffixValue).toEqual(Constants.EOL + '</${pdict.isForm === \'true\' ? \'form\' : \'div\'}>' + Constants.EOL);
    });

    it('ignores opening comment strings within comments', () => {
        const rootNode     = getRootNodeFromTemplate(44);
        const headNode     = rootNode.children[0];
        const htmlComment0 = headNode.children[0];
        const htmlComment1 = headNode.children[1];

        expect(headNode.value).toEqual('<head>');
        expect(htmlComment0.value).toEqual(`${Constants.EOL}    <!--[if gt IE 9]><!-->`);
        expect(htmlComment1.value).toEqual(`${Constants.EOL}    <!--<![endif]-->`);
    });

    it('allows an HTML element as first child of a parent node', () => {
        const rootNode     = getRootNodeFromTemplate(45);
        const spanNode     = rootNode.children[0];
        const htmlComment0 = spanNode.children[0];
        const divNode      = rootNode.children[1];
        const htmlComment1 = divNode.children[0];

        expect(htmlComment0.value).toEqual(`${Constants.EOL}    <!-- Comment 1 -->`);
        expect(htmlComment1.value).toEqual(`${Constants.EOL}    <!-- Comment 2 -->`);
    });

    it('allows an ISML expression within HTML comment', () => {
        const rootNode    = getRootNodeFromTemplate(46);
        const commentNode = rootNode.children[0];

        expect(commentNode.value).toEqual(`${Constants.EOL}<!-- dw="\${value}" -->${Constants.EOL}`);
    });

    it('allows unclosed <isprint> tag', () => {
        const rootNode    = getRootNodeFromTemplate(47);
        const isprintNode = rootNode.children[0].children[0];

        expect(isprintNode.value).toEqual(`${Constants.EOL}    <isprint value="\${pdict.response[pdict.serviceReply]['reasonCode']}">`);
    });

    it('allows unclosed <iscontent> tag', () => {
        const rootNode      = getRootNodeFromTemplate(48);
        const iscontentNode = rootNode.children[0];

        expect(iscontentNode.value).toEqual('<iscontent type="text/html" charset="UTF-8">');
    });

    it('allows slashy <isif> tags: <isif condition="${...}" />', () => {
        const rootNode      = getRootNodeFromTemplate(49);
        const iscontentNode = rootNode.children[0];

        expect(iscontentNode.value).toEqual('<div>');
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

        expect(expNode.value).toEqual('\n    ${someValue < 3}\n');
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

        expect(textNode.value).toEqual(' <isif condition="${aCondition}"> ');
        expect(textNode.getType()).toEqual('text');
    });

    it('identifies <!DOCTYPE> tags as self-closing', () => {
        const rootNode    = getRootNodeFromTemplate(63);
        const docTypeNode = rootNode.children[0];
        const divNode     = rootNode.children[1];

        expect(rootNode.children.length).toEqual(2);
        expect(docTypeNode.isDocType() ) .toEqual(true);
        expect(docTypeNode.value       ).toEqual('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">');
        expect(divNode.value           ).toEqual(`${Constants.EOL}<div>`);
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
