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
});

const getFilePath = number => {
    return `${Constants.specLineNumberTemplateDir}/sample_file_${number}.isml`;
};
