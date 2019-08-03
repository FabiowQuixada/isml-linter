const SpecHelper  = require('../../SpecHelper');
const TreeBuilder = require('../../../src/app/isml_tree/TreeBuilder');
const Constants   = require('../../../src/app/Constants');
const ParseStatus = require('../../../src/app/enums/ParseStatus');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('parses a complex template I', () => {
        const result       = TreeBuilder.build(getTemplatePath(0));
        const rootNode     = result.rootNode;
        const commentNode  = rootNode.children[2];
        const setNode      = rootNode.children[7];
        const trNode       = rootNode.children[9];
        const tdNode       = trNode.children[4];
        const availNode    = tdNode.children[9];
        const ifNode       = availNode.children[0].children[0];
        const nestedIfNode = ifNode.children[1].children[0];
        const lastTdNode   = rootNode.children[11];

        expect(result.status).toEqual(ParseStatus.NO_ERRORS);
        expect(rootNode.getNumberOfChildren()).toEqual(12);

        expect(commentNode.value).toEqual(`${Constants.EOL}${Constants.EOL}<iscomment>`);
        expect(commentNode.lineNumber).toEqual(4);
        expect(commentNode.getNumberOfChildren()).toEqual(1);

        expect(trNode.value).toEqual(`${Constants.EOL}${Constants.EOL}<tr class="cart_row lineItem-\${lineItem.getUUID()} product-\${productLineItem.productID}">`);
        expect(trNode.lineNumber).toEqual(21);
        expect(trNode.getNumberOfChildren()).toEqual(7);

        expect(setNode.value).toEqual(`${Constants.EOL}<isset name="ProductUtils" value="\${require('file_path/cartridge/scripts/product/ProductUtils')}" scope="page" />`);
        expect(setNode.lineNumber).toEqual(18);
        expect(setNode.getNumberOfChildren()).toEqual(0);

        expect(trNode.value).toEqual(`${Constants.EOL}${Constants.EOL}<tr class="cart_row lineItem-\${lineItem.getUUID()} product-\${productLineItem.productID}">`);
        expect(trNode.lineNumber).toEqual(21);
        expect(trNode.getNumberOfChildren()).toEqual(7);

        expect(tdNode.value).toEqual(`${Constants.EOL}${Constants.EOL}    <td class="item_details">`);
        expect(tdNode.lineNumber).toEqual(35);
        expect(tdNode.getNumberOfChildren()).toEqual(10);

        expect(availNode.value).toEqual(`${Constants.EOL}        <div class="product-availability">`);
        expect(availNode.lineNumber).toEqual(67);
        expect(availNode.getNumberOfChildren()).toEqual(1);

        expect(ifNode.value).toEqual(`${Constants.EOL}            <isif condition="\${isDiscontinued || isOutOfStock}">`);
        expect(ifNode.lineNumber).toEqual(68);
        expect(ifNode.getNumberOfChildren()).toEqual(2);

        expect(nestedIfNode.value).toEqual(`${Constants.EOL}                <isif condition="\${isOutOfStock}">`);
        expect(nestedIfNode.lineNumber).toEqual(72);
        expect(nestedIfNode.getNumberOfChildren()).toEqual(3);

        expect(lastTdNode.value).toEqual(`${Constants.EOL}<td class="item_total">`);
        expect(lastTdNode.lineNumber).toEqual(102);
        expect(lastTdNode.getNumberOfChildren()).toEqual(1);
    });

    it('parses a complex template II', () => {
        const result          = TreeBuilder.build(getTemplatePath(1));
        const rootNode        = result.rootNode;
        const firstDivNode    = rootNode.children[1];
        const htmlCommentNode = rootNode.children[4];
        const errorMsgNode    = rootNode.children[5].children[1].children[0].children[2];
        const inputNode       = rootNode.children[6].children[1].children[0].children[1];
        const inputValue      = Constants.EOL +
        '            <input type="text" class="form-control billingZipCode" id="billingZipCode"' + Constants.EOL +
        '                value="${pdict.order.billing.billingAddress.address' + Constants.EOL +
        '                    && pdict.order.billing.billingAddress.address.postalCode' + Constants.EOL +
        '                    ? pdict.order.billing.billingAddress.address.postalCode' + Constants.EOL +
        '                    : \'\'}"' + Constants.EOL +
        '                <isprint value=${billingFields.postalCode.attributes} encoding="off"/>' + Constants.EOL +
        '                autocomplete="billing postal-code"/>';

        expect(result.status).toEqual(ParseStatus.NO_ERRORS);
        expect(rootNode.getNumberOfChildren()).toEqual(7);

        expect(firstDivNode.value).toEqual(`${Constants.EOL}<div class="row">`);
        expect(firstDivNode.lineNumber).toEqual(2);
        expect(firstDivNode.getNumberOfChildren()).toEqual(2);

        expect(htmlCommentNode.value).toEqual(`${Constants.EOL}${Constants.EOL}<!--- make drop down -->`);
        expect(htmlCommentNode.lineNumber).toEqual(71);
        expect(htmlCommentNode.getNumberOfChildren()).toEqual(0);

        expect(errorMsgNode.value).toEqual(`${Constants.EOL}            <div class="invalid-feedback">`);
        expect(errorMsgNode.lineNumber).toEqual(116);
        expect(errorMsgNode.getNumberOfChildren()).toEqual(0);

        expect(inputNode.value).toEqual(inputValue);
        expect(inputNode.lineNumber).toEqual(142);
        expect(inputNode.getNumberOfChildren()).toEqual(0);
    });

    it('parses a complex template III', () => {
        const result          = TreeBuilder.build(getTemplatePath(2));
        const rootNode        = result.rootNode;
        const loopNode        = rootNode.children[0];
        const sectionNode     = loopNode.children[0].children[0].children[0].children[4].children[0].children[1];
        const commentNode     = sectionNode.children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[1];
        const modalFooterNode = rootNode.children[1];
        const otherLoopNode   = modalFooterNode.children[0].children[0].children[1].children[1];
        const iNode           = otherLoopNode.children[0].children[1].children[0];

        expect(loopNode.value).toEqual('<isloop items="${pdict.products}" var="product" status="productLoopStatus">');
        expect(loopNode.lineNumber).toEqual(1);
        expect(loopNode.getNumberOfChildren()).toEqual(1);

        expect(sectionNode.value).toEqual(`${Constants.EOL}                        <section class="attributes">`);
        expect(sectionNode.lineNumber).toEqual(14);
        expect(sectionNode.getNumberOfChildren()).toEqual(1);

        expect(commentNode.value).toEqual(`${Constants.EOL}                                                        <!-- Quantity Drop Down Menu -->`);
        expect(commentNode.lineNumber).toEqual(26);
        expect(commentNode.getNumberOfChildren()).toEqual(0);

        expect(modalFooterNode.value).toEqual(`${Constants.EOL}${Constants.EOL}<div class="modal-footer">`);
        expect(modalFooterNode.lineNumber).toEqual(94);
        expect(modalFooterNode.getNumberOfChildren()).toEqual(1);

        expect(otherLoopNode.value).toEqual(`${Constants.EOL}                <isloop items="\${pdict.selectedBonusProducts}" var="selectedProduct" status="productLoopStatus">`);
        expect(otherLoopNode.lineNumber).toEqual(102);
        expect(otherLoopNode.getNumberOfChildren()).toEqual(1);

        expect(iNode.value).toEqual('<i class="fa fa-times" aria-hidden="true">');
        expect(iNode.lineNumber).toEqual(109);
        expect(iNode.getNumberOfChildren()).toEqual(0);
    });

    it('parses a complex template IV', () => {
        const result             = TreeBuilder.build(getTemplatePath(3));
        const rootNode           = result.rootNode;
        const setNode            = rootNode.children[0];
        const cardNumberRowNode  = rootNode.children[3];
        const phoneRowNode       = rootNode.children[6];
        const tooltipMessageNode = phoneRowNode.children[1].children[0].children[1].children[1].children[0];

        expect(setNode.value).toEqual('<isset name="creditFields" value="${pdict.forms.billingForm.creditCardFields}" scope="page"/>');
        expect(setNode.lineNumber).toEqual(1);
        expect(setNode.getNumberOfChildren()).toEqual(0);

        expect(cardNumberRowNode.value).toEqual(`${Constants.EOL}${Constants.EOL}<div class="row">`);
        expect(cardNumberRowNode.lineNumber).toEqual(8);
        expect(cardNumberRowNode.getNumberOfChildren()).toEqual(1);

        expect(phoneRowNode.value).toEqual(`${Constants.EOL}${Constants.EOL}<div class="row">`);
        expect(phoneRowNode.lineNumber).toEqual(94);
        expect(phoneRowNode.getNumberOfChildren()).toEqual(2);

        expect(tooltipMessageNode.value).toEqual(`${Constants.EOL}                    \${Resource.msg('tooltip.phone.number','creditCard',null)}${Constants.EOL}                `);
        expect(tooltipMessageNode.lineNumber).toEqual(119);
        expect(tooltipMessageNode.getNumberOfChildren()).toEqual(0);
    });
});

const getTemplatePath = number => {
    return `${Constants.specComplexTemplatesDir}/template_${number}.isml`;
};
