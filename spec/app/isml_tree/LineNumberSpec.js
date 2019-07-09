const SpecHelper  = require('../../SpecHelper');
const TreeBuilder = require('../../../src/app/isml_tree/TreeBuilder');
const Constants   = require('../../../src/app/Constants');

describe('TreeBuilder', () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('sets line number for a very simple html DOM', () => {
        const rootNode = TreeBuilder.build(getFilePath(0)).rootNode;

        expect(rootNode.getChild(0).getLineNumber()                         ).toEqual(1);
        expect(rootNode.getChild(0).getChild(0).getLineNumber()             ).toEqual(1);
        expect(rootNode.getChild(1).getLineNumber()                         ).toEqual(2);
        expect(rootNode.getChild(1).getChild(0).getLineNumber()             ).toEqual(3);
        expect(rootNode.getChild(1).getChild(0).getChild(0).getLineNumber() ).toEqual(4);
    });

    it('sets line number for a very simple html DOM with multi-line elements', () => {
        const rootNode = TreeBuilder.build(getFilePath(1)).rootNode;

        expect(rootNode.getChild(0).getChild(0).getLineNumber()).toEqual(5);
    });

    it('sets line numbers form level-3-deep tree', () => {
        const rootNode = TreeBuilder.build(getFilePath(2)).rootNode;

        expect(rootNode.getChild(1).getLineNumber()                         ).toEqual(2);
        expect(rootNode.getChild(1).getChild(0).getLineNumber()             ).toEqual(6);
        expect(rootNode.getChild(1).getChild(0).getChild(0).getLineNumber() ).toEqual(7);
        expect(rootNode.getChild(2).getLineNumber()                         ).toEqual(13);
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

        const divNode    = rootNode.getChild(0);
        const isifNode   = divNode.getChild(0).getChild(0);
        const customNode = isifNode.getChild(0);

        expect(divNode.getDepth()         ).toEqual(1);
        expect(divNode.getLineNumber()    ).toEqual(1);
        expect(isifNode.getDepth()        ).toEqual(2);
        expect(isifNode.getLineNumber()   ).toEqual(2);
        expect(customNode.getDepth()      ).toEqual(3);
        expect(customNode.getLineNumber() ).toEqual(3);
    });

    it('sets line number for a simple "iselse" tag', () => {
        const rootNode   = TreeBuilder.build(getFilePath(6)).rootNode;
        const divNode    = rootNode.getChild(0);
        const isifNode   = divNode.getChild(0).getChild(0);
        const iselseNode = divNode.getChild(0).getChild(1);
        const customNode = isifNode.getChild(0);

        expect(divNode.getDepth()         ).toEqual(1);
        expect(divNode.getLineNumber()    ).toEqual(1);
        expect(isifNode.getDepth()        ).toEqual(2);
        expect(isifNode.getLineNumber()   ).toEqual(2);
        expect(customNode.getDepth()      ).toEqual(3);
        expect(customNode.getLineNumber() ).toEqual(3);
        expect(iselseNode.getDepth()      ).toEqual(2);
        expect(iselseNode.getLineNumber() ).toEqual(4);
    });

    it('sets line number for a simple "iselseif" tag', () => {
        const rootNode     = TreeBuilder.build(getFilePath(7)).rootNode;
        const divNode      = rootNode.getChild(0);
        const isifNode     = divNode.getChild(0).getChild(0);
        const iselseifNode = divNode.getChild(0).getChild(1);
        const iselseNode   = divNode.getChild(0).getChild(2);
        const customNode   = isifNode.getChild(0);
        const customNode2  = iselseNode.getChild(0);

        expect(divNode.getDepth()           ).toEqual(1);
        expect(divNode.getLineNumber()      ).toEqual(1);
        expect(isifNode.getDepth()          ).toEqual(2);
        expect(isifNode.getLineNumber()     ).toEqual(2);
        expect(customNode.getDepth()        ).toEqual(3);
        expect(customNode.getLineNumber()   ).toEqual(3);
        expect(iselseifNode.getDepth()      ).toEqual(2);
        expect(iselseifNode.getLineNumber() ).toEqual(4);
        expect(iselseNode.getDepth()        ).toEqual(2);
        expect(iselseNode.getLineNumber()   ).toEqual(6);
        expect(customNode2.getDepth()       ).toEqual(3);
        expect(customNode2.getLineNumber()  ).toEqual(7);
    });

    it('sets correct line number when there is a nested isml element', () => {
        const rootNode     = TreeBuilder.build(getFilePath(8)).rootNode;
        const selectNode   = rootNode.getChild(0);
        const emptyNode    = selectNode.getChild(0);
        const errorMsgNode = rootNode.getChild(1);
        const selectValue  = '' +
        `<select class="form-control billingState custom-select" id="billingState"${Constants.EOL}` +
        `    <isprint value=\${billingFields.states.stateCode.attributes} encoding="off"/>${Constants.EOL}` +
        '    autocomplete="billing address-level1">';

        expect(selectNode.getValue()            ).toEqual(selectValue);
        expect(selectNode.getLineNumber()       ).toEqual(1);
        expect(selectNode.getNumberOfChildren() ).toEqual(1);

        expect(errorMsgNode.getValue()            ).toEqual(`${Constants.EOL}<div class="invalid-feedback">`);
        expect(errorMsgNode.getLineNumber()       ).toEqual(9);
        expect(errorMsgNode.getNumberOfChildren() ).toEqual(0);

        expect(emptyNode.getValue()).toEqual(`${Constants.EOL}${Constants.EOL}${Constants.EOL}${Constants.EOL}${Constants.EOL}`);
    });

    it('identifies a single-child non-tag element line number', () => {
        const rootNode   = TreeBuilder.build(getFilePath(9)).rootNode;
        const ifNode     = rootNode.getChild(0).getChild(0).getChild(0).getChild(0);
        const nonTagNode = ifNode.getChild(0).getChild(1).getChild(0);

        expect(ifNode.getValue()               ).toEqual(`${Constants.EOL}        <isif condition="\${pdict.customer.registeredUser}">`);
        expect(ifNode.getLineNumber()          ).toEqual(4);
        expect(ifNode.getNumberOfChildren()    ).toEqual(2);
        expect(ifNode.getLastChild().isEmpty() ).toBe(true);

        expect(nonTagNode.getValue()            ).toEqual(`${Constants.EOL}                    \${creditFields.saveCard.label}${Constants.EOL}                `);
        expect(nonTagNode.getLineNumber()       ).toEqual(8);
        expect(nonTagNode.getNumberOfChildren() ).toEqual(0);
    });
});

const getFilePath = number => {
    return `${Constants.specLineNumberTemplateDir}/template_${number}.isml`;
};
