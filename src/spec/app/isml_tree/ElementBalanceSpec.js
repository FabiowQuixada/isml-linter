const TreeBuilder = require('../../../app/isml_tree/TreeBuilder');
const SpecHelper  = require('../../SpecHelper');
const Constants   = require('../../../app/Constants');

describe('TreeBuilder', () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('gets unbalanced element length', () => {
        const tree = getTreeFromTemplate(0);

        expect(tree.exception.length).toEqual(10);
    });

    it('gets unbalanced element length II', () => {
        const tree = getTreeFromTemplate(1);

        expect(tree.exception.length).toEqual(52);
    });
});

const getFilePath = number => {
    return `${Constants.specElementBalanceTemplatesDir}/template_${number}.isml`;
};

const getTreeFromTemplate = number => {
    const filePath = getFilePath(number);
    return TreeBuilder.build(filePath);
};
