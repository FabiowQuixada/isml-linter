const TreeBuilder = require('../../../app/isml_tree/TreeBuilder');
const SpecHelper = require('../../SpecHelper');
const Constants = require('../../../app/Constants');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('parses a complex template I', () => {
        const rootNode     = TreeBuilder.build(getFilePath(0)).rootNode;
        const commentNode  = rootNode.getChild(2);
        const setNode      = rootNode.getChild(7);
        const trNode       = rootNode.getChild(9);
        const tdNode       = trNode.getChild(4);
        const availNode    = tdNode.getChild(9);
        const ifNode       = availNode.getChild(0).getChild(0);
        const nestedIfNode = ifNode.getChild(1).getChild(0);
        const lastTdNode   = rootNode.getChild(11);

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
});

const getFilePath = number => {
    return `${Constants.specComplexTemplatesDir}/sample_file_${number}.isml`;
};
