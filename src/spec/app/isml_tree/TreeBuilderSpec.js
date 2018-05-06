const TreeBuilder = require('../../../app/isml_tree/TreeBuilder');
const SpecHelper = require('../../SpecHelper');
const Constants = require('../../../app/Constants');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('creates a one-level-deep tree with correct number of children', () => {
        const rootNode = TreeBuilder.build(getFilePath(0));

        expect(rootNode.getNumberOfChildren()).toEqual(5);
    });

    it('creates a one-level-deep tree with node values', () => {
        const rootNode = TreeBuilder.build(getFilePath(0));

        expect(rootNode.getChild(3).getValue()).toEqual('<isset name="lineItem" value="${\'some value\'}" scope="page" />');
    });

    it('creates a tree with non-self-closing tags', () => {
        const rootNode = TreeBuilder.build(getFilePath(0));

        expect(rootNode.getChild(2).getValue()).toEqual('<div>');
    });
});

const getFilePath = number => {
    return `${Constants.specIsmlTreeTemplateDir}/sample_file_${number}.isml`;
};
