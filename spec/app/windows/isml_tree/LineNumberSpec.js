const SpecHelper  = require('../../../SpecHelper');
const TreeBuilder = require('../../../../src/isml_tree/TreeBuilder');
const Constants   = require('../../../../src/Constants');

describe('TreeBuilder', () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('sets line number for a very simple html DOM', () => {
        const rootNode = TreeBuilder.build(getTemplatePath(0)).rootNode;

        expect(rootNode.children[0].lineNumber                         ).toEqual(1);
        expect(rootNode.children[0].children[0].lineNumber             ).toEqual(1);
        expect(rootNode.children[1].lineNumber                         ).toEqual(2);
        expect(rootNode.children[1].children[0].lineNumber             ).toEqual(3);
        expect(rootNode.children[1].children[0].children[0].lineNumber ).toEqual(4);
    });

    it('sets line number for a very simple html DOM with multi-line elements', () => {
        const rootNode = TreeBuilder.build(getTemplatePath(1)).rootNode;

        expect(rootNode.children[0].children[0].lineNumber).toEqual(5);
    });

    it('sets line numbers form level-3-deep tree', () => {
        const rootNode = TreeBuilder.build(getTemplatePath(2)).rootNode;

        expect(rootNode.children[1].lineNumber                         ).toEqual(2);
        expect(rootNode.children[1].children[0].lineNumber             ).toEqual(6);
        expect(rootNode.children[1].children[0].children[0].lineNumber ).toEqual(7);
        expect(rootNode.children[2].lineNumber                         ).toEqual(13);
    });

    it('sets line number for a very simple html DOM with multiple blank lines', () => {

        const rootNode = TreeBuilder.build(getTemplatePath(3)).rootNode;

        expect(rootNode.children[0].children[0].lineNumber).toEqual(10);
        expect(rootNode.children[1].lineNumber).toEqual(16);
    });

    it('sets line number for a very simple html DOM with multi-line elements with child starting in the same line', () => {
        const rootNode = TreeBuilder.build(getTemplatePath(4)).rootNode;

        expect(rootNode.children[0].children[0].lineNumber).toEqual(4);
    });

    it('sets line number for a simple "isif" tag', () => {
        const rootNode = TreeBuilder.build(getTemplatePath(5)).rootNode;

        const divNode    = rootNode.children[0];
        const isifNode   = divNode.children[0].children[0];
        const customNode = isifNode.children[0];

        expect(divNode.depth         ).toEqual(1);
        expect(divNode.lineNumber    ).toEqual(1);
        expect(isifNode.depth        ).toEqual(2);
        expect(isifNode.lineNumber   ).toEqual(2);
        expect(customNode.depth      ).toEqual(3);
        expect(customNode.lineNumber ).toEqual(3);
    });

    it('sets line number for a simple "iselse" tag', () => {
        const rootNode   = TreeBuilder.build(getTemplatePath(6)).rootNode;
        const divNode    = rootNode.children[0];
        const isifNode   = divNode.children[0].children[0];
        const iselseNode = divNode.children[0].children[1];
        const customNode = isifNode.children[0];

        expect(divNode.depth         ).toEqual(1);
        expect(divNode.lineNumber    ).toEqual(1);
        expect(isifNode.depth        ).toEqual(2);
        expect(isifNode.lineNumber   ).toEqual(2);
        expect(customNode.depth      ).toEqual(3);
        expect(customNode.lineNumber ).toEqual(3);
        expect(iselseNode.depth      ).toEqual(2);
        expect(iselseNode.lineNumber ).toEqual(4);
    });

    it('sets line number for a simple "iselseif" tag', () => {
        const rootNode     = TreeBuilder.build(getTemplatePath(7)).rootNode;
        const divNode      = rootNode.children[0];
        const isifNode     = divNode.children[0].children[0];
        const iselseifNode = divNode.children[0].children[1];
        const iselseNode   = divNode.children[0].children[2];
        const customNode   = isifNode.children[0];
        const customNode2  = iselseNode.children[0];

        expect(divNode.depth           ).toEqual(1);
        expect(divNode.lineNumber      ).toEqual(1);
        expect(isifNode.depth          ).toEqual(2);
        expect(isifNode.lineNumber     ).toEqual(2);
        expect(customNode.depth        ).toEqual(3);
        expect(customNode.lineNumber   ).toEqual(3);
        expect(iselseifNode.depth      ).toEqual(2);
        expect(iselseifNode.lineNumber ).toEqual(4);
        expect(iselseNode.depth        ).toEqual(2);
        expect(iselseNode.lineNumber   ).toEqual(6);
        expect(customNode2.depth       ).toEqual(3);
        expect(customNode2.lineNumber  ).toEqual(7);
    });

    it('sets correct line number when there is a nested isml element', () => {
        const rootNode     = TreeBuilder.build(getTemplatePath(8)).rootNode;
        const selectNode   = rootNode.children[0];
        const errorMsgNode = rootNode.children[1];
        const selectValue  = '' +
        `<select class="form-control billingState custom-select" id="billingState"${Constants.EOL}` +
        `    <isprint value=\${billingFields.states.stateCode.attributes} encoding="off"/>${Constants.EOL}` +
        '    autocomplete="billing address-level1">';

        expect(selectNode.head             ).toEqual(selectValue);
        expect(selectNode.lineNumber       ).toEqual(1);
        expect(selectNode.getChildrenQty() ).toEqual(0);

        expect(errorMsgNode.head             ).toEqual(`${Constants.EOL}<div class="invalid-feedback">`);
        expect(errorMsgNode.lineNumber       ).toEqual(9);
        expect(errorMsgNode.getChildrenQty() ).toEqual(0);
    });

    it('identifies a single-child non-tag element line number', () => {
        const rootNode   = TreeBuilder.build(getTemplatePath(9)).rootNode;
        const ifNode     = rootNode.children[0].children[0].children[0].children[0];
        const nonTagNode = ifNode.children[0].children[1].children[0];

        expect(ifNode.head                 ).toEqual(`${Constants.EOL}        <isif condition="\${pdict.customer.registeredUser}">`);
        expect(ifNode.lineNumber           ).toEqual(4);
        expect(ifNode.getChildrenQty()).toEqual(1);

        expect(nonTagNode.head                 ).toEqual(`${Constants.EOL}                    \${creditFields.saveCard.label}`);
        expect(nonTagNode.lineNumber           ).toEqual(8);
        expect(nonTagNode.getChildrenQty()).toEqual(0);
    });

    it('sets line number for <iselse> element', () => {
        const rootNode   = TreeBuilder.build(getTemplatePath(10)).rootNode;
        const divNode    = rootNode.children[0];
        const iselseNode = divNode.children[0].children[1];

        expect(iselseNode.lineNumber).toEqual(4);
    });
});

const getTemplatePath = number => {
    return SpecHelper.getTemplatePath(Constants.specLineNumberTemplateDir, number);
};
