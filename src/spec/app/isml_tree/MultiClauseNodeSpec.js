const IsmlNode = require('../../../app/isml_tree/IsmlNode');
const MultiClauseNode = require('../../../app/isml_tree/MultiClauseNode');
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

    it('has no clauses nodes when created', () => {
        const rootNode = new MultiClauseNode();

        expect(rootNode.getNumberOfChildren()).toEqual(0);
    });

    it('adds a clause to itself', () => {
        const rootNode = new MultiClauseNode();
        const childNode = new IsmlNode();

        rootNode.addChild(childNode);

        expect(rootNode.getNumberOfChildren()).toEqual(1);
    });

    it('has the same height as its child-clauses', () => {
        const rootNode = new MultiClauseNode();
        const childNode = new IsmlNode();

        rootNode.addChild(childNode);

        expect(childNode.getHeight()).toEqual(rootNode.getHeight());
    });

    it('does NOT print itself', () => {
        const rootNode = new MultiClauseNode();
        const childNode = new IsmlNode();

        rootNode.addChild(childNode);
        childNode.setValue('<div />');

        rootNode.print();

        expect(spy.firstCall.args[0]).toEqual('0 :: 0 :: <div />');
    });

    it('prints its clauses', () => {
        const rootNode = new MultiClauseNode();
        const childNode1 = new IsmlNode();
        const childNode2 = new IsmlNode();

        childNode1.setValue('<isif>');
        childNode2.setValue('<iselse>');

        rootNode.addChild(childNode1);
        rootNode.addChild(childNode2);

        rootNode.print();

        expect(spy.firstCall.args[0]).toEqual('0 :: 0 :: <isif>');
        expect(spy.secondCall.args[0]).toEqual('0 :: 0 :: <iselse>');
    });
});