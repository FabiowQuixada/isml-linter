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
        const result       = TreeBuilder.build(getFilePath(0));
        const rootNode     = result.rootNode;
        const commentNode  = rootNode.getChild(2);
        const setNode      = rootNode.getChild(7);
        const trNode       = rootNode.getChild(9);
        const tdNode       = trNode.getChild(4);
        const availNode    = tdNode.getChild(9);
        const ifNode       = availNode.getChild(0).getChild(0);
        const nestedIfNode = ifNode.getChild(1).getChild(0);
        const lastTdNode   = rootNode.getChild(11);

        expect(result.status).toEqual(ParseStatus.NO_ERRORS);
        expect(rootNode.getNumberOfChildren()).toEqual(13);
        expect(rootNode.getLastChild().isEmpty()).toBe(true);

        expect(commentNode.getValue()).toEqual(`${Constants.EOL}${Constants.EOL}<iscomment>`);
        expect(commentNode.getLineNumber()).toEqual(4);
        expect(commentNode.getNumberOfChildren()).toEqual(1);

        expect(trNode.getValue()).toEqual(`${Constants.EOL}${Constants.EOL}<tr class="cart_row lineItem-\${lineItem.getUUID()} product-\${productLineItem.productID}">`);
        expect(trNode.getLineNumber()).toEqual(21);
        expect(trNode.getNumberOfChildren()).toEqual(8);
        expect(trNode.getLastChild().isEmpty()).toBe(true);

        expect(setNode.getValue()).toEqual(`${Constants.EOL}<isset name="ProductUtils" value="\${require('file_path/cartridge/scripts/product/ProductUtils')}" scope="page" />`);
        expect(setNode.getLineNumber()).toEqual(18);
        expect(setNode.getNumberOfChildren()).toEqual(0);

        expect(trNode.getValue()).toEqual(`${Constants.EOL}${Constants.EOL}<tr class="cart_row lineItem-\${lineItem.getUUID()} product-\${productLineItem.productID}">`);
        expect(trNode.getLineNumber()).toEqual(21);
        expect(trNode.getNumberOfChildren()).toEqual(8);
        expect(trNode.getLastChild().isEmpty()).toBe(true);

        expect(tdNode.getValue()).toEqual(`${Constants.EOL}${Constants.EOL}    <td class="item_details">`);
        expect(tdNode.getLineNumber()).toEqual(35);
        expect(tdNode.getNumberOfChildren()).toEqual(11);
        expect(tdNode.getLastChild().isEmpty()).toBe(true);

        expect(availNode.getValue()).toEqual(`${Constants.EOL}        <div class="product-availability">`);
        expect(availNode.getLineNumber()).toEqual(67);
        expect(availNode.getNumberOfChildren()).toEqual(2);
        expect(availNode.getLastChild().isEmpty()).toBe(true);

        expect(ifNode.getValue()).toEqual(`${Constants.EOL}            <isif condition="\${isDiscontinued || isOutOfStock}">`);
        expect(ifNode.getLineNumber()).toEqual(68);
        expect(ifNode.getNumberOfChildren()).toEqual(3);
        expect(ifNode.getLastChild().isEmpty()).toBe(true);

        expect(nestedIfNode.getValue()).toEqual(`${Constants.EOL}                <isif condition="\${isOutOfStock}">`);
        expect(nestedIfNode.getLineNumber()).toEqual(72);
        expect(nestedIfNode.getNumberOfChildren()).toEqual(4);
        expect(nestedIfNode.getLastChild().isEmpty()).toBe(true);

        expect(lastTdNode.getValue()).toEqual(`${Constants.EOL}<td class="item_total">`);
        expect(lastTdNode.getLineNumber()).toEqual(102);
        expect(lastTdNode.getNumberOfChildren()).toEqual(2);
        expect(lastTdNode.getLastChild().isEmpty()).toBe(true);
    });

    it('parses a complex template II', () => {
        const result          = TreeBuilder.build(getFilePath(1));
        const rootNode        = result.rootNode;
        const firstDivNode    = rootNode.getChild(1);
        const htmlCommentNode = rootNode.getChild(4);
        const errorMsgNode    = rootNode.getChild(5).getChild(1).getChild(0).getChild(2);
        const inputNode       = rootNode.getChild(6).getChild(1).getChild(0).getChild(1);
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

        expect(firstDivNode.getValue()).toEqual(`${Constants.EOL}<div class="row">`);
        expect(firstDivNode.getLineNumber()).toEqual(2);
        expect(firstDivNode.getNumberOfChildren()).toEqual(3);
        expect(firstDivNode.getLastChild().isEmpty()).toBe(true);

        expect(htmlCommentNode.getValue()).toEqual(`${Constants.EOL}${Constants.EOL}<!--- make drop down -->`);
        expect(htmlCommentNode.getLineNumber()).toEqual(71);
        expect(htmlCommentNode.getNumberOfChildren()).toEqual(0);

        expect(errorMsgNode.getValue()).toEqual(`${Constants.EOL}            <div class="invalid-feedback">`);
        expect(errorMsgNode.getLineNumber()).toEqual(116);
        expect(errorMsgNode.getNumberOfChildren()).toEqual(0);

        expect(inputNode.getValue()).toEqual(inputValue);
        expect(inputNode.getLineNumber()).toEqual(142);
        expect(inputNode.getNumberOfChildren()).toEqual(0);
    });

    it('parses a complex template III', () => {
        const result          = TreeBuilder.build(getFilePath(2));
        const rootNode        = result.rootNode;
        const loopNode        = rootNode.getChild(0);
        const sectionNode     = loopNode.getChild(0).getChild(0).getChild(0).getChild(4).getChild(0).getChild(1);
        const commentNode     = sectionNode.getChild(0).getChild(0).getChild(0).getChild(0).getChild(0).getChild(0).getChild(1).getChild(0).getChild(1);
        const modalFooterNode = rootNode.getChild(1);
        const otherLoopNode   = modalFooterNode.getChild(0).getChild(0).getChild(1).getChild(1);
        const iNode           = otherLoopNode.getChild(0).getChild(1).getChild(0);

        expect(loopNode.getValue()).toEqual('<isloop items="${pdict.products}" var="product" status="productLoopStatus">');
        expect(loopNode.getLineNumber()).toEqual(1);
        expect(loopNode.getNumberOfChildren()).toEqual(2);
        expect(loopNode.getLastChild().isEmpty()).toBe(true);

        expect(sectionNode.getValue()).toEqual(`${Constants.EOL}                        <section class="attributes">`);
        expect(sectionNode.getLineNumber()).toEqual(14);
        expect(sectionNode.getNumberOfChildren()).toEqual(2);
        expect(sectionNode.getLastChild().isEmpty()).toBe(true);

        expect(commentNode.getValue()).toEqual(`${Constants.EOL}                                                        <!-- Quantity Drop Down Menu -->`);
        expect(commentNode.getLineNumber()).toEqual(26);
        expect(commentNode.getNumberOfChildren()).toEqual(0);

        expect(modalFooterNode.getValue()).toEqual(`${Constants.EOL}${Constants.EOL}<div class="modal-footer">`);
        expect(modalFooterNode.getLineNumber()).toEqual(94);
        expect(modalFooterNode.getNumberOfChildren()).toEqual(2);
        expect(modalFooterNode.getLastChild().isEmpty()).toBe(true);

        expect(otherLoopNode.getValue()).toEqual(`${Constants.EOL}                <isloop items="\${pdict.selectedBonusProducts}" var="selectedProduct" status="productLoopStatus">`);
        expect(otherLoopNode.getLineNumber()).toEqual(102);
        expect(otherLoopNode.getNumberOfChildren()).toEqual(2);
        expect(otherLoopNode.getLastChild().isEmpty()).toBe(true);

        expect(iNode.getValue()).toEqual('<i class="fa fa-times" aria-hidden="true">');
        expect(iNode.getLineNumber()).toEqual(109);
        expect(iNode.getNumberOfChildren()).toEqual(0);
    });

    it('parses a complex template IV', () => {
        const result             = TreeBuilder.build(getFilePath(3));
        const rootNode           = result.rootNode;
        const setNode            = rootNode.getChild(0);
        const cardNumberRowNode  = rootNode.getChild(3);
        const phoneRowNode       = rootNode.getChild(6);
        const tooltipMessageNode = phoneRowNode.getChild(1).getChild(0).getChild(1).getChild(1).getChild(0);

        expect(setNode.getValue()).toEqual('<isset name="creditFields" value="${pdict.forms.billingForm.creditCardFields}" scope="page"/>');
        expect(setNode.getLineNumber()).toEqual(1);
        expect(setNode.getNumberOfChildren()).toEqual(0);

        expect(cardNumberRowNode.getValue()).toEqual(`${Constants.EOL}${Constants.EOL}<div class="row">`);
        expect(cardNumberRowNode.getLineNumber()).toEqual(8);
        expect(cardNumberRowNode.getNumberOfChildren()).toEqual(2);
        expect(cardNumberRowNode.getLastChild().isEmpty()).toBe(true);

        expect(phoneRowNode.getValue()).toEqual(`${Constants.EOL}${Constants.EOL}<div class="row">`);
        expect(phoneRowNode.getLineNumber()).toEqual(94);
        expect(phoneRowNode.getNumberOfChildren()).toEqual(3);
        expect(phoneRowNode.getLastChild().isEmpty()).toBe(true);

        expect(tooltipMessageNode.getValue()).toEqual(`${Constants.EOL}                    \${Resource.msg('tooltip.phone.number','creditCard',null)}${Constants.EOL}                `);
        expect(tooltipMessageNode.getLineNumber()).toEqual(119);
        expect(tooltipMessageNode.getNumberOfChildren()).toEqual(0);
    });
});

const getFilePath = number => {
    return `${Constants.specComplexTemplatesDir}/template_${number}.isml`;
};
