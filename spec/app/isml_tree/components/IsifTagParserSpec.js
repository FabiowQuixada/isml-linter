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

        const templatePath    = getTemplatePath(0);
        const rootNode        = TreeBuilder.build(templatePath).rootNode;
        const multiClauseNode = rootNode.children[0];

        expect(multiClauseNode.getNumberOfChildren()).toEqual(2);
        expect(multiClauseNode.children[0].value).toEqual(`<isif condition="\${true}">${Constants.EOL}`);
        expect(multiClauseNode.children[1].value).toEqual(`<iselse>    ${Constants.EOL}`);
    });

    it('parser simple non-empty isif-iselse tag', () => {

        const templatePath    = getTemplatePath(1);
        const rootNode        = TreeBuilder.build(templatePath).rootNode;
        const multiClauseNode = rootNode.children[0];

        expect(multiClauseNode.getNumberOfChildren()).toEqual(2);
        expect(multiClauseNode.children[0].children[0].value).toEqual(`${Constants.EOL}    <hey/>${Constants.EOL}`);
        expect(multiClauseNode.children[1].children[0].value).toEqual(`${Constants.EOL}    <ho/>${Constants.EOL}`);
    });

    it('sets correct global position for <iselse> tag', () => {
        const templatePath    = getTemplatePath(1);
        const rootNode        = TreeBuilder.build(templatePath).rootNode;
        const multiClauseNode = rootNode.children[0];
        const iselseNode      = multiClauseNode.children[1];

        expect(iselseNode.globalPos).toEqual(38);
    });

    it('sets correct global position for <iselseif> tags', () => {
        const templatePath    = getTemplatePath(2);
        const rootNode        = TreeBuilder.build(templatePath).rootNode;
        const multiClauseNode = rootNode.children[0];
        const iselseifNode    = multiClauseNode.children[1];
        const iselseNode      = multiClauseNode.children[2];

        expect(iselseifNode.globalPos).toEqual(39);
        expect(iselseNode.globalPos).toEqual(86);
    });

    it('sets the children of a multiclause node correctly, with no duplicates', () => {
        const templatePath    = getTemplatePath(2);
        const rootNode        = TreeBuilder.build(templatePath).rootNode;
        const multiClauseNode = rootNode.children[0];

        expect(multiClauseNode.getNumberOfChildren()).toEqual(3);
    });

    it('parses a multi-clause isif-iselseif-iselse tag', () => {

        const templatePath    = getTemplatePath(2);
        const rootNode        = TreeBuilder.build(templatePath).rootNode;
        const multiClauseNode = rootNode.children[0];

        expect(multiClauseNode.getNumberOfChildren()).toEqual(3);
        expect(multiClauseNode.children[0].value).toEqual('<isif condition="${first}">');
        expect(multiClauseNode.children[1].value).toEqual('<iselseif condition="${second}">');
        expect(multiClauseNode.children[2].value).toEqual('<iselse>');
    });
});

const getTemplatePath = number => {
    return `${Constants.specIsifTagParserTemplateDir}/template_${number}.isml`;
};
