const SpecHelper = require('../../../SpecHelper');
const Constants = require('../../../../app/Constants');
const TreeBuilder = require('../../../../app/isml_tree/TreeBuilder');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('parses an simple empty isif-iselse tag', () => {

        const filePath = getFilePath(0);
        const rootNode = TreeBuilder.build(filePath);
        const multiClauseNode = rootNode.getChild(0);

        expect(multiClauseNode.getNumberOfClauses()).toEqual(2);
        expect(multiClauseNode.getClause(0).getValue()).toEqual('<isif condition="${true}">');
        expect(multiClauseNode.getClause(1).getValue()).toEqual('<iselse>');
    });

    it('parser simple non-empty isif-iselse tag', () => {

        const filePath = getFilePath(1);
        const rootNode = TreeBuilder.build(filePath);
        const multiClauseNode = rootNode.getChild(0);

        expect(multiClauseNode.getNumberOfClauses()).toEqual(2);
        expect(multiClauseNode.getClause(0).getChild(0).getValue()).toEqual('    <hey/>');
        expect(multiClauseNode.getClause(1).getChild(0).getValue()).toEqual('    <ho/>');
    });

    it('parses a multi-clause isif-iselseif-iselse tag', () => {

        const filePath = getFilePath(2);
        const rootNode = TreeBuilder.build(filePath);
        const multiClauseNode = rootNode.getChild(0);

        expect(multiClauseNode.getNumberOfClauses()).toEqual(3);
        expect(multiClauseNode.getClause(0).getValue()).toEqual('<isif condition="${first}">');
        expect(multiClauseNode.getClause(1).getValue()).toEqual('<iselseif condition="${second}">');
        expect(multiClauseNode.getClause(2).getValue()).toEqual('<iselse>');
    });
});

const getFilePath = number => {
    return `${Constants.specIsifTagParserTemplateDir}/sample_file_${number}.isml`;
};
