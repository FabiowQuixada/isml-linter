const sinon       = require('sinon');
const SpecHelper  = require('../../../SpecHelper');
const IsmlNode    = require('../../../../src/isml_tree/IsmlNode');
const ConfigUtils = require('../../../../src/util/ConfigUtils');
const TreeBuilder = require('../../../../src/isml_tree/TreeBuilder');
const Constants   = require('../../../../src/Constants');

const targetObjName   = SpecHelper.getTargetObjName(__filename);
const isCrlfLineBreak = true;

describe(targetObjName, () => {

    let spy = null;

    beforeEach(() => {
        SpecHelper.beforeEach();
        spy = sinon.spy(console, 'log');
    });

    afterEach(() => {
        SpecHelper.afterEach();
        spy.restore();
    });

    it('has no children nodes when created', () => {
        const rootNode = new IsmlNode();

        expect(rootNode.getNumberOfChildren()).toEqual(0);
    });

    it('adds a child to itself', () => {
        const rootNode  = new IsmlNode();
        const childNode = new IsmlNode();

        rootNode.addChild(childNode);

        expect(rootNode.getNumberOfChildren()).toEqual(1);
    });

    it('stores the correspondent self-closing isml/html element', () => {
        const rootNode = new IsmlNode('<div/>');

        expect(rootNode.getType()).toEqual('div');
    });

    it('stores the correspondent non-self-closing isml/html element', () => {
        const rootNode = new IsmlNode('<div>');

        expect(rootNode.getType()).toEqual('div');
    });

    it('stores the correspondent self-closing with space isml/html element', () => {
        const rootNode = new IsmlNode('<div />');

        expect(rootNode.getType()).toEqual('div');
    });

    it('knows if it is a self-closing tag', () => {
        const rootNode = new IsmlNode('<div/>');

        expect(rootNode.isSelfClosing()).toEqual(true);
    });

    it('knows when it is not self-closing tag', () => {
        const rootNode = new IsmlNode('<div>');

        expect(rootNode.isSelfClosing()).toEqual(false);
    });

    it('has a depth one unit above its parent', () => {
        const rootNode  = new IsmlNode();
        const childNode = new IsmlNode();

        rootNode.addChild(childNode);

        expect(childNode.depth).toEqual(rootNode.depth + 1);
    });

    it('gets the correct type for isml tag', () => {
        const rootNode  = new IsmlNode('<isif condition"${}">');

        expect(rootNode.getType()).toEqual('isif');
    });

    it('gets the correct type for elements that contain numbers', () => {
        const node = new IsmlNode('<h1>');

        expect(node.getType()).toEqual('h1');
    });

    it('gets the correct type for html comments', () => {
        const node = new IsmlNode('<!-- Im a comment -->');

        expect(node.getType()).toEqual('html_comment');
    });

    it('prints itself', () => {
        const rootNode = new IsmlNode();

        rootNode.print();

        expect(spy.firstCall.args[0]).toEqual('0 :: 0 :: (root)');
    });

    it('prints its children', () => {
        const rootNode  = new IsmlNode();
        const childNode = new IsmlNode('<span class="some_class">');

        rootNode.addChild(childNode);
        rootNode.print();

        expect(spy.secondCall.args[0]).toEqual('1 :: 0 ::     <span class="some_class">');
    });

    it('prints its inner text', () => {
        const rootNode  = new IsmlNode('<span class="some_class">');
        const childNode = new IsmlNode('Some text');

        rootNode.addChild(childNode);
        rootNode.print();

        expect(spy.secondCall.args[0]).toEqual('1 :: 0 ::     ' + childNode.value);
    });

    it('prints its value halted if it is too long', () => {
        const rootNode = new IsmlNode('<div class="the-value-of-this-element-is-really-really-long"></div>');

        rootNode.print();

        expect(spy.firstCall.args[0]).toEqual('0 :: 0 :: <div class="the-value-of-th...');
    });

    it('prints value without duplicated spaces', () => {
        const rootNode = new IsmlNode('<div      class="some_class"></div>');

        rootNode.print();

        expect(spy.firstCall.args[0]).toEqual('0 :: 0 :: <div class="some_class"></d...');
    });

    it('prints multi-line elements in a single line', () => {
        const rootNode = new IsmlNode(`<div     ${Constants.EOL}    class="some_class"></div>`);

        rootNode.print();

        expect(spy.firstCall.args[0]).toEqual('0 :: 0 :: <div class="some_class"></d...');
    });

    it('sets doctype node as self-closing', () => {
        const rootNode = new IsmlNode('<!DOCTYPE html>');

        expect(rootNode.isSelfClosing()).toEqual(true);
    });

    it('knows if it is a void element', () => {
        const rootNode = new IsmlNode('<img>');

        expect(rootNode.isVoidElement()).toEqual(true);
    });

    it('knows if it is a non-void element if HTML 5 parsing is disabled', () => {
        ConfigUtils.load({
            disableHtml5: true
        });
        const rootNode = new IsmlNode('<img>');

        expect(rootNode.isVoidElement()).toEqual(false);
    });

    it('knows if it is a non-void element', () => {
        const rootNode = new IsmlNode('<table>');

        expect(rootNode.isVoidElement()).toEqual(false);
    });

    it('identifies a SFCC original isml tag', () => {
        const node = new IsmlNode('<isslot>');

        expect(node.isCustomIsmlTag()).toEqual(false);
    });

    it('identifies a custom isml tag', () => {
        const node = new IsmlNode('<ismycustom>');

        expect(node.isCustomIsmlTag()).toEqual(true);
    });

    it('removes a child node', () => {
        const removeIndex     = 3;
        const rootNode        = getTreeRootFromComplexTemplate(0);
        const childrenQty     = rootNode.getNumberOfChildren();
        const nodeToBeRemoved = rootNode.children[removeIndex];

        rootNode.removeChild(nodeToBeRemoved);

        const nextNode = rootNode.children[removeIndex];

        expect(nodeToBeRemoved.id).not.toEqual(nextNode.id);
        expect(rootNode.getNumberOfChildren()).toEqual(childrenQty - 1);
    });

    it('returns the removed node on remove operation', () => {
        const removeIndex     = 3;
        const rootNode        = getTreeRootFromComplexTemplate(0);
        const nodeToBeRemoved = rootNode.children[removeIndex];
        const removedNode     = rootNode.removeChild(nodeToBeRemoved);

        expect(nodeToBeRemoved.id).toEqual(removedNode.id);
    });

    it('adds a child node at a specific position', () => {
        const rootNode    = getTreeRootFromTemplate(0);
        const childrenQty = rootNode.getNumberOfChildren();
        const newNode     = new IsmlNode('<ismycustom />');

        rootNode.addChildNodeToPos(newNode, 0);

        expect(rootNode.children[0].id).toEqual(newNode.id);
        expect(newNode.parent.id).toEqual(rootNode.id);
        expect(rootNode.getNumberOfChildren()).toEqual(childrenQty + 1);
    });

    it('knows if a node is a descendant of a node of given type', () => {
        const rootNode      = getTreeRootFromComplexTemplate(0);
        const customTagNode = rootNode.children[11].children[0].children[0];

        expect(customTagNode.isDescendantOf('td')).toEqual(true);
    });

    it('knows if a node is not a descendant of a node of given type', () => {
        const rootNode      = getTreeRootFromComplexTemplate(0);
        const customTagNode = rootNode.children[11].children[0].children[0];

        expect(customTagNode.isDescendantOf('iscomment')).toEqual(false);
    });

    it('detects correct indentation', () => {
        const rootNode = getTreeRootFromTemplate(0);
        const divNode  = rootNode.children[0].children[0];

        expect(divNode.children[0].getIndentationSize()).toEqual(8);
        expect(divNode.children[1].getIndentationSize()).toEqual(8);
        expect(divNode.children[2].getIndentationSize()).toEqual(8);
    });

    it('sets head end line number correctly', () => {
        const rootNode = getTreeRootFromTemplate(1);
        const spanNode = rootNode.children[0].children[0];

        expect(spanNode.endLineNumber).toEqual(2);
    });

    it('differentiates between single-line tags from multiline tags', () => {
        const rootNode    = getTreeRootFromTemplate(2);
        const sectionNode = rootNode.children[0];
        const divNode     = sectionNode.children[0];
        const spanNode    = divNode.children[0];

        expect(divNode.isMultiLineOpeningTag()).toEqual(true);
        expect(spanNode.isMultiLineOpeningTag()).toEqual(false);
    });

    it('identifies if attributes are on the same line as of the opening tag', () => {
        const rootNode      = getTreeRootFromTemplate(2);
        const divNode       = rootNode.children[0].children[0];
        const attributeList = divNode.getAttributeList();

        expect(attributeList[0].isInSameLineAsTagName).toEqual(true);
        expect(attributeList[1].isInSameLineAsTagName).toEqual(false);
        expect(attributeList[2].isInSameLineAsTagName).toEqual(false);
        expect(attributeList[3].isInSameLineAsTagName).toEqual(false);
    });

    it('identifies attributes line numbers', () => {
        const rootNode      = getTreeRootFromTemplate(2);
        const divNode       = rootNode.children[0].children[0];
        const attributeList = divNode.getAttributeList();

        expect(attributeList[0].lineNumber).toEqual(2);
        expect(attributeList[1].lineNumber).toEqual(3);
        expect(attributeList[2].lineNumber).toEqual(4);
        expect(attributeList[3].lineNumber).toEqual(5);
    });

    it('identifies attributes column numbers', () => {
        const rootNode      = getTreeRootFromTemplate(2);
        const divNode       = rootNode.children[0].children[0];
        const attributeList = divNode.getAttributeList();

        expect(attributeList[0].columnNumber).toEqual(10);
        expect(attributeList[1].columnNumber).toEqual(9);
        expect(attributeList[2].columnNumber).toEqual(7);
        expect(attributeList[3].columnNumber).toEqual(10);
    });

    it('identifies attributes column numbers II', () => {
        const rootNode      = getTreeRootFromTemplate(2);
        const spanNode      = rootNode.children[0].children[1];
        const attributeList = spanNode.getAttributeList();

        expect(attributeList[0].columnNumber).toEqual(9);
        expect(attributeList[1].columnNumber).toEqual(9);
    });

    it('identifies attributes global positions', () => {
        const rootNode      = getTreeRootFromTemplate(2);
        const divNode       = rootNode.children[0].children[0];
        const attributeList = divNode.getAttributeList();

        expect(attributeList[0].globalPos).toEqual(19);
        expect(attributeList[1].globalPos).toEqual(39);
        expect(attributeList[2].globalPos).toEqual(63);
        expect(attributeList[3].globalPos).toEqual(92);
    });

    it('identifies attributes global positions II', () => {
        const rootNode      = getTreeRootFromTemplate(3);
        const divNode       = rootNode.children[0];
        const attributeList = divNode.getAttributeList();

        expect(attributeList[0].globalPos).toEqual(6);
        expect(attributeList[1].globalPos).toEqual(21);
        expect(attributeList[2].globalPos).toEqual(45);
        expect(attributeList[3].globalPos).toEqual(71);
    });

    it('identifies if an attribute is the first in line', () => {
        const rootNode      = getTreeRootFromTemplate(4);
        const buttonNode    = rootNode.children[0].children[0];
        const attributeList = buttonNode.getAttributeList();

        expect(attributeList[1].isFirstInLine).toEqual(true);
    });

    it('identifies if an attribute is not the first in line', () => {
        const rootNode      = getTreeRootFromTemplate(4);
        const buttonNode    = rootNode.children[0].children[0];
        const attributeList = buttonNode.getAttributeList();

        expect(attributeList[2].isFirstInLine).toEqual(false);
    });

    it('identifies that an attribute is never the first in line if it is in the same line as tag name', () => {
        const rootNode      = getTreeRootFromTemplate(4);
        const buttonNode    = rootNode.children[0].children[0];
        const attributeList = buttonNode.getAttributeList();

        expect(attributeList[0].isFirstInLine).toEqual(false);
    });

    it('processes an embedded "isprint" "attribute"', () => {
        const rootNode      = getTreeRootFromTemplate(5);
        const buttonNode    = rootNode.children[0].children[0];
        const attributeList = buttonNode.getAttributeList();

        expect(attributeList[1].lineNumber   ).toEqual(4);
        expect(attributeList[1].columnNumber ).toEqual(9);
        expect(attributeList[1].length       ).toEqual(59);
        expect(attributeList[1].globalPos    ).toEqual(53);
        expect(attributeList[1].localPos     ).toEqual(43);
    });

    it('processes an embedded "isif" "attribute"', () => {
        const rootNode      = getTreeRootFromTemplate(6);
        const buttonNode    = rootNode.children[0].children[0];
        const attributeList = buttonNode.getAttributeList();

        expect(attributeList[1].lineNumber   ).toEqual(4);
        expect(attributeList[1].columnNumber ).toEqual(9);
        expect(attributeList[1].length       ).toEqual(187);
        expect(attributeList[1].globalPos    ).toEqual(52);
        expect(attributeList[1].localPos     ).toEqual(42);
    });

    it('processes attributes that contains an expression', () => {
        const rootNode      = getTreeRootFromTemplate(7);
        const inputNode     = rootNode.children[0].children[0];
        const attributeList = inputNode.getAttributeList();

        expect(attributeList[2].name         ).toEqual('data-range-error');
        expect(attributeList[2].lineNumber   ).toEqual(5);
        expect(attributeList[2].columnNumber ).toEqual(5);
        expect(attributeList[2].length       ).toEqual(34);
        expect(attributeList[2].globalPos    ).toEqual(74);
        expect(attributeList[2].localPos     ).toEqual(64);
    });

    it('processes more than one attribute that contains an expression', () => {
        const rootNode      = getTreeRootFromTemplate(8);
        const inputNode     = rootNode.children[0].children[0];
        const attributeList = inputNode.getAttributeList();

        expect(attributeList[1].name         ).toEqual('data-range-error');
        expect(attributeList[1].lineNumber   ).toEqual(4);
        expect(attributeList[1].columnNumber ).toEqual(6);
        expect(attributeList[1].length       ).toEqual(39);
        expect(attributeList[1].globalPos    ).toEqual(74);
        expect(attributeList[1].localPos     ).toEqual(64);
    });

    it('processes more than one attribute that contains an expression within quotes', () => {
        const rootNode      = getTreeRootFromTemplate(9);
        const buttonNode    = rootNode.children[0].children[0];
        const attributeList = buttonNode.getAttributeList();

        expect(attributeList[1].fullValue    ).toEqual('class="class-1 class-2 ${aCondition ? \'disabled\' : \'\'}"');
        expect(attributeList[1].lineNumber   ).toEqual(4);
        expect(attributeList[1].columnNumber ).toEqual(13);
        expect(attributeList[1].length       ).toEqual(55);
        expect(attributeList[1].globalPos    ).toEqual(61);
        expect(attributeList[1].localPos     ).toEqual(51);
    });

    it('parses an attribute that is fully dynamic (an expression)', () => {
        const rootNode      = getTreeRootFromTemplate(10);
        const buttonNode    = rootNode.children[0].children[0];
        const attributeList = buttonNode.getAttributeList();

        expect(attributeList[1].fullValue    ).toEqual('${dynamicAttribute}');
        expect(attributeList[1].lineNumber   ).toEqual(4);
        expect(attributeList[1].columnNumber ).toEqual(5);
        expect(attributeList[1].length       ).toEqual(19);
        expect(attributeList[1].globalPos    ).toEqual(48);
        expect(attributeList[1].localPos     ).toEqual(38);
    });

    it('parses attributes with in-quote expression', () => {
        const rootNode      = getTreeRootFromTemplate(11);
        const inputNode     = rootNode.children[0].children[0];
        const attributeList = inputNode.getAttributeList();

        expect(attributeList[1].fullValue).toEqual('placeholder="${Resource.msg("key", "dotProperties", null)}"');
    });

    it('identifies a node as "conditional comment" type (downlevel-hidden)', () => {
        const rootNode               = getTreeRootFromTemplate(13);
        const htmlCommentNode        = rootNode.children[0];
        const conditionalCommentNode = rootNode.children[1];

        expect(htmlCommentNode.isConditionalComment()       ).toEqual(false);
        expect(conditionalCommentNode.isConditionalComment()).toEqual(true);
    });

    it('parses attributes with multi-line value', () => {
        const rootNode          = getTreeRootFromTemplate(15);
        const spanNode1         = rootNode.children[0];
        const attributeList     = spanNode1.getAttributeList();
        const classAttribute    = attributeList[1];
        const dataInfoAttribute = attributeList[2];

        expect(classAttribute.name              ).toEqual('class');
        expect(classAttribute.value             ).toEqual(`${Constants.EOL}        class-1${Constants.EOL}        class-2${Constants.EOL}        class-3${Constants.EOL}    `);
        expect(classAttribute.hasMultilineValue ).toEqual(true);

        expect(dataInfoAttribute.name              ).toEqual('data-info');
        expect(dataInfoAttribute.value             ).toEqual('info-1 info-2 info-3');
        expect(dataInfoAttribute.hasMultilineValue ).toEqual(false);
    });
});

const getIsmlNodeTemplatePath = number => {
    return SpecHelper.getTemplatePath(Constants.specIsmlNodeTemplateDir, number);
};

const getTreeRootFromComplexTemplate = number => {
    const templatePath = SpecHelper.getTemplatePath(Constants.specComplexTemplatesDir, number);
    return TreeBuilder.build(templatePath, undefined, isCrlfLineBreak).rootNode;
};

const getTreeRootFromTemplate = number => {
    const templatePath = getIsmlNodeTemplatePath(number);
    return TreeBuilder.build(templatePath, undefined, isCrlfLineBreak).rootNode;
};
