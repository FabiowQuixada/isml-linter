const fs = require('fs');
const IsifTagParser = require('../../../../app/isml_tree/components/IsifTagParser');
const SpecHelper = require('../../../SpecHelper');
const Constants = require('../../../../app/Constants');
const IsmlNode = require('../../../../app/isml_tree/IsmlNode');

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
        const fileContent = fs.readFileSync(filePath, 'utf-8').replace(/(\r\n\t|\n|\r\t)/gm, '');
        const rootNode = IsifTagParser.run(new IsmlNode(), fileContent);
        const multiClauseNode = rootNode.getChild(0);

        expect(multiClauseNode.getNumberOfClauses()).toEqual(2);
        expect(multiClauseNode.getClause(0).getValue()).toEqual('<isif condition="${true}">');
        expect(multiClauseNode.getClause(1).getValue()).toEqual('<iselse>');
    });

    it('parser simple non-empty isif-iselse tag', () => {

        const filePath = getFilePath(1);
        const fileContent = fs.readFileSync(filePath, 'utf-8').replace(/(\r\n\t|\n|\r\t)/gm, '');
        const rootNode = IsifTagParser.run(new IsmlNode(), fileContent);
        const multiClauseNode = rootNode.getChild(0);

        expect(multiClauseNode.getNumberOfClauses()).toEqual(2);
        expect(multiClauseNode.getClause(0).getChild(0).getValue()).toEqual('    <hey/>');
        expect(multiClauseNode.getClause(1).getChild(0).getValue()).toEqual('    <ho/>');
    });
});

const getFilePath = number => {
    return `${Constants.specIsifTagParserTemplateDir}/sample_file_${number}.isml`;
};
