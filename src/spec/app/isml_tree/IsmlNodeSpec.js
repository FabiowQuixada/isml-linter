const IsmlNode    = require('../../../app/isml_tree/IsmlNode');
const SpecHelper  = require('../../SpecHelper');
const ConfigUtils = require('../../../app/util/ConfigUtils');
const TreeBuilder = require('../../../app/isml_tree/TreeBuilder');
const Constants   = require('../../../app/Constants');
const sinon       = require('sinon');

const targetObjName = SpecHelper.getTargetObjName(__filename);

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
        const rootNode = new IsmlNode();

        rootNode.setValue('<div/>');

        expect(rootNode.getType()).toEqual('div');
    });

    it('stores the correspondent non-self-closing isml/html element', () => {
        const rootNode = new IsmlNode();

        rootNode.setValue('<div>');

        expect(rootNode.getType()).toEqual('div');
    });

    it('stores the correspondent self-closing with space isml/html element', () => {
        const rootNode = new IsmlNode();

        rootNode.setValue('<div />');

        expect(rootNode.getType()).toEqual('div');
    });

    it('knows if it is a self-closing tag', () => {
        const rootNode = new IsmlNode();

        rootNode.setValue('<div/>');

        expect(rootNode.isSelfClosing()).toEqual(true);
    });

    it('knows when it is not self-closing tag', () => {
        const rootNode = new IsmlNode();

        rootNode.setValue('<div>');

        expect(rootNode.isSelfClosing()).toEqual(false);
    });

    it('has a depth one unit above its parent', () => {
        const rootNode  = new IsmlNode();
        const childNode = new IsmlNode();

        rootNode.addChild(childNode);

        expect(childNode.getDepth()).toEqual(rootNode.getDepth() + 1);
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
        const childNode = new IsmlNode();
        childNode.setValue('<span class="some_class">');
        rootNode.addChild(childNode);

        rootNode.print();

        expect(spy.secondCall.args[0]).toEqual('1 :: 0 ::     <span class="some_class">');
    });

    it('prints its inner text', () => {
        const rootNode  = new IsmlNode();
        const childNode = new IsmlNode();
        rootNode.addChild(childNode);

        rootNode.setValue('<span class="some_class">');
        childNode.setValue('Some text');

        rootNode.print();

        expect(spy.secondCall.args[0]).toEqual('1 :: 0 ::     ' + childNode.getValue());
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
        const tree            = TreeBuilder.build(getFilePath(0));
        const rootNode        = tree.rootNode;
        const childrenQty     = rootNode.getNumberOfChildren();
        const nodeToBeRemoved = rootNode.getChild(removeIndex);

        rootNode.removeChild(nodeToBeRemoved);

        const nextNode = rootNode.getChild(removeIndex);

        expect(nodeToBeRemoved.id).not.toEqual(nextNode.id);
        expect(rootNode.getNumberOfChildren()).toEqual(childrenQty - 1);
    });

    it('returns the removed node on remove operation', () => {
        const removeIndex     = 3;
        const tree            = TreeBuilder.build(getFilePath(0));
        const rootNode        = tree.rootNode;
        const nodeToBeRemoved = rootNode.getChild(removeIndex);
        const removedNode     = rootNode.removeChild(nodeToBeRemoved);

        expect(nodeToBeRemoved.id).toEqual(removedNode.id);
    });

    it('adds a child node at a specific position', () => {
        const tree        = TreeBuilder.build(getFilePath(0));
        const rootNode    = tree.rootNode;
        const childrenQty = rootNode.getNumberOfChildren();
        const newNode     = new IsmlNode('<ismycustom />');

        rootNode.addChildNodeToPos(newNode, 0);

        expect(rootNode.getChild(0).id).toEqual(newNode.id);
        expect(newNode.getParent().id).toEqual(rootNode.id);
        expect(rootNode.getNumberOfChildren()).toEqual(childrenQty + 1);
    });
});

const getFilePath = number => {
    return `${Constants.specComplexTemplatesDir}/template_${number}.isml`;
};
