const SpecHelper  = require('../../../SpecHelper');
const Constants   = require('../../../../src/app/Constants');
const TreeBuilder = require('../../../../src/app/isml_tree/TreeBuilder');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('parses an simple empty isif-iselse tag', () => {

        const filePath        = getFilePath(0);
        const rootNode        = TreeBuilder.build(filePath).rootNode;
        const multiClauseNode = rootNode.getChild(0);

        expect(multiClauseNode.getNumberOfChildren()).toEqual(2);
        expect(multiClauseNode.getChild(0).getValue()).toEqual('<isif condition="${true}">');
        expect(multiClauseNode.getChild(1).getValue()).toEqual('<iselse>');
    });

    it('parser simple non-empty isif-iselse tag', () => {

        const filePath        = getFilePath(1);
        const rootNode        = TreeBuilder.build(filePath).rootNode;
        const multiClauseNode = rootNode.getChild(0);

        expect(multiClauseNode.getNumberOfChildren()).toEqual(2);
        expect(multiClauseNode.getChild(0).getChild(0).getValue()).toEqual(`${Constants.EOL}    <hey/>`);
        expect(multiClauseNode.getChild(1).getChild(0).getValue()).toEqual(`${Constants.EOL}    <ho/>`);
    });

    it('parses a multi-clause isif-iselseif-iselse tag', () => {

        const filePath        = getFilePath(2);
        const rootNode        = TreeBuilder.build(filePath).rootNode;
        const multiClauseNode = rootNode.getChild(0);

        expect(multiClauseNode.getNumberOfChildren()).toEqual(3);
        expect(multiClauseNode.getChild(0).getValue()).toEqual('<isif condition="${first}">');
        expect(multiClauseNode.getChild(1).getValue()).toEqual('<iselseif condition="${second}">');
        expect(multiClauseNode.getChild(2).getValue()).toEqual('<iselse>');
    });
});

const getFilePath = number => {
    return `${Constants.specIsifTagParserTemplateDir}/template_${number}.isml`;
};
