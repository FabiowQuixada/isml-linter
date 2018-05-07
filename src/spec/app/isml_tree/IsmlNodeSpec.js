const IsmlNode = require('../../../app/isml_tree/IsmlNode');
const SpecHelper = require('../../SpecHelper');
const sinon = require('sinon');

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
        const rootNode = new IsmlNode();
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

    it('has a height one unit above its parent', () => {
        const rootNode = new IsmlNode();
        const childNode = new IsmlNode();

        rootNode.addChild(childNode);

        expect(childNode.getHeight()).toEqual(rootNode.getHeight() + 1);
    });

    it('prints itself', () => {
        const rootNode = new IsmlNode();

        rootNode.print();

        expect(spy.firstCall.args[0]).toEqual('0 :: (root)');
    });

    it('prints its children', () => {
        const rootNode = new IsmlNode();
        const childNode = new IsmlNode();
        childNode.setValue('<span class="some_class">');
        rootNode.addChild(childNode);

        rootNode.print();

        expect(spy.secondCall.args[0]).toEqual('1 ::     <span class="some_class">');
    });

    it('prints its inner text', () => {
        const rootNode = new IsmlNode();
        rootNode.setValue('<span class="some_class">');
        rootNode.setInnerText('Some text');

        rootNode.print();

        expect(spy.secondCall.args[0]).toEqual('1 ::    [plain text] ' + rootNode.getInnerText());
    });
});
