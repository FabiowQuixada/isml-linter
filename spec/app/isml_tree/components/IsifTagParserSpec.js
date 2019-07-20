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
        expect(multiClauseNode.getChild(0).getValue()).toEqual('<isif condition="${true}">\n');
        expect(multiClauseNode.getChild(1).getValue()).toEqual('<iselse>    \n');
    });

    it('parser simple non-empty isif-iselse tag', () => {

        const filePath        = getFilePath(1);
        const rootNode        = TreeBuilder.build(filePath).rootNode;
        const multiClauseNode = rootNode.getChild(0);

        expect(multiClauseNode.getNumberOfChildren()).toEqual(2);
        expect(multiClauseNode.getChild(0).getChild(0).getValue()).toEqual(`${Constants.EOL}    <hey/>${Constants.EOL}`);
        expect(multiClauseNode.getChild(1).getChild(0).getValue()).toEqual(`${Constants.EOL}    <ho/>${Constants.EOL}`);
    });

    it('sets correct global position for <iselse> tag', () => {
        const filePath        = getFilePath(1);
        const rootNode        = TreeBuilder.build(filePath).rootNode;
        const multiClauseNode = rootNode.getChild(0);
        const iselseNode      = multiClauseNode.getChild(1);

        expect(iselseNode.getGlobalPos()).toEqual(38);
    });

    it('sets correct global position for <iselseif> tags', () => {
        const filePath        = getFilePath(2);
        const rootNode        = TreeBuilder.build(filePath).rootNode;
        const multiClauseNode = rootNode.getChild(0);
        const iselseifNode    = multiClauseNode.getChild(1);
        const iselseNode      = multiClauseNode.getChild(2);

        expect(iselseifNode.getGlobalPos()).toEqual(39);
        expect(iselseNode.getGlobalPos()).toEqual(86);
    });

    it('sets the children of a multiclause node correctly, with no duplicates', () => {
        const filePath        = getFilePath(2);
        const rootNode        = TreeBuilder.build(filePath).rootNode;
        const multiClauseNode = rootNode.getChild(0);

        expect(multiClauseNode.getNumberOfChildren()).toEqual(3);
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
