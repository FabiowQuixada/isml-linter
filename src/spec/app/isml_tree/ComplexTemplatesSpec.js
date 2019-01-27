const TreeBuilder = require('../../../app/isml_tree/TreeBuilder');
const SpecHelper  = require('../../SpecHelper');
const Constants   = require('../../../app/Constants');
const ParseStatus = require('../../../app/enums/ParseStatus');

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
        expect(rootNode.getNumberOfChildren()).toEqual(12);

        expect(commentNode.getValue()).toEqual('\n\n<iscomment>');
        expect(commentNode.getLineNumber()).toEqual(4);
        expect(commentNode.getNumberOfChildren()).toEqual(1);

        expect(trNode.getValue()).toEqual('\n\n<tr class="cart_row lineItem-${lineItem.getUUID()} product-${productLineItem.productID}">');
        expect(trNode.getLineNumber()).toEqual(21);
        expect(trNode.getNumberOfChildren()).toEqual(7);

        expect(setNode.getValue()).toEqual('\n<isset name="ProductUtils" value="${require(\'file_path/cartridge/scripts/product/ProductUtils\')}" scope="page" />');
        expect(setNode.getLineNumber()).toEqual(18);
        expect(setNode.getNumberOfChildren()).toEqual(0);

        expect(trNode.getValue()).toEqual('\n\n<tr class="cart_row lineItem-${lineItem.getUUID()} product-${productLineItem.productID}">');
        expect(trNode.getLineNumber()).toEqual(21);
        expect(trNode.getNumberOfChildren()).toEqual(7);

        expect(tdNode.getValue()).toEqual('\n\n    <td class="item_details">');
        expect(tdNode.getLineNumber()).toEqual(35);
        expect(tdNode.getNumberOfChildren()).toEqual(10);

        expect(availNode.getValue()).toEqual('\n        <div class="product-availability">');
        expect(availNode.getLineNumber()).toEqual(67);
        expect(availNode.getNumberOfChildren()).toEqual(1);

        expect(ifNode.getValue()).toEqual('\n            <isif condition="${isDiscontinued || isOutOfStock}">');
        expect(ifNode.getLineNumber()).toEqual(68);
        expect(ifNode.getNumberOfChildren()).toEqual(2);

        expect(nestedIfNode.getValue()).toEqual('\n                <isif condition="${isOutOfStock}">');
        expect(nestedIfNode.getLineNumber()).toEqual(72);
        expect(nestedIfNode.getNumberOfChildren()).toEqual(3);

        expect(lastTdNode.getValue()).toEqual('\n<td class="item_total">');
        expect(lastTdNode.getLineNumber()).toEqual(102);
        expect(lastTdNode.getNumberOfChildren()).toEqual(1);
    });

    it('parses a complex template II', () => {
        const result          = TreeBuilder.build(getFilePath(1));
        const rootNode        = result.rootNode;
        const firstDivNode    = rootNode.getChild(1);
        const htmlCommentNode = rootNode.getChild(4);
        const errorMsgNode    = rootNode.getChild(5).getChild(1).getChild(0).getChild(2);
        const inputNode       = rootNode.getChild(6).getChild(1).getChild(0).getChild(1);
        const inputValue      = '\n' +
        '            <input type="text" class="form-control billingZipCode" id="billingZipCode"\n' +
        '                value="${pdict.order.billing.billingAddress.address\n' +
        '                    && pdict.order.billing.billingAddress.address.postalCode\n' +
        '                    ? pdict.order.billing.billingAddress.address.postalCode\n' +
        '                    : \'\'}"\n' +
        '                <isprint value=${billingFields.postalCode.attributes} encoding="off"/>\n' +
        '                autocomplete="billing postal-code"/>';

        expect(result.status).toEqual(ParseStatus.NO_ERRORS);
        expect(rootNode.getNumberOfChildren()).toEqual(7);

        expect(firstDivNode.getValue()).toEqual('\n<div class="row">');
        expect(firstDivNode.getLineNumber()).toEqual(2);
        expect(firstDivNode.getNumberOfChildren()).toEqual(2);

        expect(htmlCommentNode.getValue()).toEqual('\n\n<!--- make drop down -->');
        expect(htmlCommentNode.getLineNumber()).toEqual(71);
        expect(htmlCommentNode.getNumberOfChildren()).toEqual(0);

        expect(errorMsgNode.getValue()).toEqual('\n            <div class="invalid-feedback">');
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
        expect(loopNode.getNumberOfChildren()).toEqual(1);

        expect(sectionNode.getValue()).toEqual('\n                        <section class="attributes">');
        expect(sectionNode.getLineNumber()).toEqual(14);
        expect(sectionNode.getNumberOfChildren()).toEqual(1);

        expect(commentNode.getValue()).toEqual('\n                                                        <!-- Quantity Drop Down Menu -->');
        expect(commentNode.getLineNumber()).toEqual(26);
        expect(commentNode.getNumberOfChildren()).toEqual(0);

        expect(modalFooterNode.getValue()).toEqual('\n\n<div class="modal-footer">');
        expect(modalFooterNode.getLineNumber()).toEqual(94);
        expect(modalFooterNode.getNumberOfChildren()).toEqual(1);

        expect(otherLoopNode.getValue()).toEqual('\n                <isloop items="${pdict.selectedBonusProducts}" var="selectedProduct" status="productLoopStatus">');
        expect(otherLoopNode.getLineNumber()).toEqual(102);
        expect(otherLoopNode.getNumberOfChildren()).toEqual(1);

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

        expect(cardNumberRowNode.getValue()).toEqual('\n\n<div class="row">');
        expect(cardNumberRowNode.getLineNumber()).toEqual(8);
        expect(cardNumberRowNode.getNumberOfChildren()).toEqual(1);

        expect(phoneRowNode.getValue()).toEqual('\n\n<div class="row">');
        expect(phoneRowNode.getLineNumber()).toEqual(94);
        expect(phoneRowNode.getNumberOfChildren()).toEqual(2);

        expect(tooltipMessageNode.getValue()).toEqual('\n                    ${Resource.msg(\'tooltip.phone.number\',\'creditCard\',null)}\n                ');
        expect(tooltipMessageNode.getLineNumber()).toEqual(119);
        expect(tooltipMessageNode.getNumberOfChildren()).toEqual(0);
    });
});

const getFilePath = number => {
    return `${Constants.specComplexTemplatesDir}/template_${number}.isml`;
};
