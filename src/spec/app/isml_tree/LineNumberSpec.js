const TreeBuilder = require('../../../app/isml_tree/TreeBuilder');
const SpecHelper = require('../../SpecHelper');
const Constants = require('../../../app/Constants');

describe('TreeBuilder', () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('sets line number for a very simple html DOM', () => {
        const rootNode = TreeBuilder.build(getFilePath(0)).rootNode;

        expect(rootNode.getChild(0).getLineNumber()).toEqual(1);
        expect(rootNode.getChild(0).getChild(0).getLineNumber()).toEqual(1);
        expect(rootNode.getChild(1).getLineNumber()).toEqual(2);
        expect(rootNode.getChild(1).getChild(0).getLineNumber()).toEqual(3);
        expect(rootNode.getChild(1).getChild(0).getChild(0).getLineNumber()).toEqual(4);
    });

    it('sets line number for a very simple html DOM with multi-line elements', () => {
        const rootNode = TreeBuilder.build(getFilePath(1)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getLineNumber()).toEqual(5);
    });

    it('sets line numbers form level-3-deep tree', () => {
        const rootNode = TreeBuilder.build(getFilePath(2)).rootNode;

        expect(rootNode.getChild(1).getLineNumber()).toEqual(2);
        expect(rootNode.getChild(1).getChild(0).getLineNumber()).toEqual(6);
        expect(rootNode.getChild(1).getChild(0).getChild(0).getLineNumber()).toEqual(7);
        expect(rootNode.getChild(2).getLineNumber()).toEqual(13);
    });

    it('sets line number for a very simple html DOM with multiple blank lines', () => {

        const rootNode = TreeBuilder.build(getFilePath(3)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getLineNumber()).toEqual(10);
        expect(rootNode.getChild(1).getLineNumber()).toEqual(16);
    });

    it('sets line number for a very simple html DOM with multi-line elements with child starting in the same line', () => {
        const rootNode = TreeBuilder.build(getFilePath(4)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getLineNumber()).toEqual(4);
    });

    it('sets line number for a simple "isif" tag', () => {
        const rootNode = TreeBuilder.build(getFilePath(5)).rootNode;

        const divNode = rootNode.getChild(0);
        const isifNode = divNode.getChild(0).getChild(0);
        const customNode = isifNode.getChild(0);

        expect(divNode.getHeight()).toEqual(1);
        expect(divNode.getLineNumber()).toEqual(1);
        expect(isifNode.getHeight()).toEqual(2);
        expect(isifNode.getLineNumber()).toEqual(2);
        expect(customNode.getHeight()).toEqual(3);
        expect(customNode.getLineNumber()).toEqual(3);
    });

    it('sets line number for a simple "iselse" tag', () => {
        const rootNode   = TreeBuilder.build(getFilePath(6)).rootNode;
        const divNode    = rootNode.getChild(0);
        const isifNode   = divNode.getChild(0).getChild(0);
        const iselseNode = divNode.getChild(0).getChild(1);
        const customNode = isifNode.getChild(0);

        expect(divNode.getHeight()).toEqual(1);
        expect(divNode.getLineNumber()).toEqual(1);
        expect(isifNode.getHeight()).toEqual(2);
        expect(isifNode.getLineNumber()).toEqual(2);
        expect(customNode.getHeight()).toEqual(3);
        expect(customNode.getLineNumber()).toEqual(3);
        expect(iselseNode.getHeight()).toEqual(2);
        expect(iselseNode.getLineNumber()).toEqual(4);
    });

    it('sets line number for a simple "iselseif" tag', () => {
        const rootNode     = TreeBuilder.build(getFilePath(7)).rootNode;
        const divNode      = rootNode.getChild(0);
        const isifNode     = divNode.getChild(0).getChild(0);
        const iselseifNode = divNode.getChild(0).getChild(1);
        const iselseNode   = divNode.getChild(0).getChild(2);
        const customNode   = isifNode.getChild(0);
        const customNode2  = iselseNode.getChild(0);

        expect(divNode.getHeight()).toEqual(1);
        expect(divNode.getLineNumber()).toEqual(1);
        expect(isifNode.getHeight()).toEqual(2);
        expect(isifNode.getLineNumber()).toEqual(2);
        expect(customNode.getHeight()).toEqual(3);
        expect(customNode.getLineNumber()).toEqual(3);
        expect(iselseifNode.getHeight()).toEqual(2);
        expect(iselseifNode.getLineNumber()).toEqual(4);
        expect(iselseNode.getHeight()).toEqual(2);
        expect(iselseNode.getLineNumber()).toEqual(6);
        expect(customNode2.getHeight()).toEqual(3);
        expect(customNode2.getLineNumber()).toEqual(7);
    });
});

const getFilePath = number => {
    return `${Constants.specLineNumberTemplateDir}/sample_file_${number}.isml`;
};
