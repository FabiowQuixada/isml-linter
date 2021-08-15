const SpecHelper  = require('../../../SpecHelper');
const IsmlNode    = require('../../../../src/isml_tree/IsmlNode');
const Constants   = require('../../../../src/Constants');
const TreeBuilder = require('../../../../src/isml_tree/TreeBuilder');

const isCrlfLineBreak = true;

describe('IsmlNode', () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('lists its attributes for single values', () => {
        const node   = new IsmlNode('<table class="some_class" style="width:7px">');
        const actual = node.getAttributeList();

        expect(actual[0].name).toEqual('class');
        expect(actual[0].value).toEqual('some_class');

        expect(actual[1].name).toEqual('style');
        expect(actual[1].value).toEqual('width:7px');
    });

    it('lists its attributes for value-less attributes', () => {
        const node   = new IsmlNode('<input type="checkbox" checked>');
        const actual = node.getAttributeList();

        expect(actual[0].name).toEqual('type');
        expect(actual[0].value).toEqual('checkbox');

        expect(actual[1].name).toEqual('checked');
        expect(actual[1].value).toEqual(null);
    });

    it('lists its attributes for attributes with more than one value', () => {
        const node   = new IsmlNode('<span class="class_1 class_2" data-url="https://">');
        const actual = node.getAttributeList();

        expect(actual[0].name).toEqual('class');
        expect(actual[0].valueList).toEqual(['class_1', 'class_2']);

        expect(actual[1].name).toEqual('data-url');
        expect(actual[1].value).toEqual('https://');
        expect(actual[1].valueList).toEqual(['https://']);
    });

    it('lists its no attributes if there is none for non-self-closing element', () => {
        const node   = new IsmlNode('<span >');
        const actual = node.getAttributeList();

        expect(actual).toEqual([]);
    });

    it('lists no attributes for hardcodes', () => {
        const node   = new IsmlNode('hardcoded-text');
        const actual = node.getAttributeList();

        expect(actual).toEqual([]);
    });

    it('lists no attributes for expressions', () => {
        const node   = new IsmlNode('${"expression"}');
        const actual = node.getAttributeList();

        expect(actual).toEqual([]);
    });

    it('lists no attributes for empty nodes', () => {
        const node   = new IsmlNode(`${Constants.EOL}  ${Constants.EOL}${Constants.EOL}`);
        const actual = node.getAttributeList();

        expect(actual).toEqual([]);
    });

    it('lists no attributes for attribute-less self-closing elements', () => {
        const node   = new IsmlNode('<div />');
        const actual = node.getAttributeList();

        expect(actual).toEqual([]);
    });

    it('lists attributes for self-closing elements', () => {
        const node   = new IsmlNode('<div class="class_1 class_2" data-url="https://" />');
        const actual = node.getAttributeList();

        expect(actual[0].name).toEqual('class');
        expect(actual[0].valueList).toEqual(['class_1', 'class_2']);

        expect(actual[1].name).toEqual('data-url');
        expect(actual[1].value).toEqual('https://');
        expect(actual[1].valueList).toEqual(['https://']);
    });

    it('detects nested isml tags as attributes', () => {
        const node   = new IsmlNode('<div class="class_1 class_2" <isif condition="${aCondition}">value</isif> />');
        const actual = node.getAttributeList();

        expect(actual[0].name).toEqual('class');
        expect(actual[0].valueList).toEqual(['class_1', 'class_2']);
        expect(actual[0].isNestedIsmlTag).toEqual(false);

        expect(actual[1].fullContent).toEqual('<isif condition="${aCondition}">value</isif>');
        expect(actual[1].isNestedIsmlTag).toEqual(true);
    });

    it('lists values separated by line breaks', () => {
        const node          = new IsmlNode('<span class="\nclass-1\nclass-2\nclass-3\n"\n/>');
        const attributeList = node.getAttributeList();

        expect(attributeList[0].name).toEqual('class');
        expect(attributeList[0].valueList).toEqual(['class-1', 'class-2', 'class-3']);
    });

    it('lists attributes when there is no indentation at all', () => {
        const rootNode      = getTreeRootFromTemplate(12);
        const spanNode      = rootNode.children[0];
        const attributeList = spanNode.getAttributeList();

        expect(attributeList[0].name).toEqual('class');
        expect(attributeList[0].valueList).toEqual(['class-1', 'class-2', 'class-3']);
    });

    it('lists consecutive dynamic attributes', () => {
        const rootNode      = getTreeRootFromTemplate(14);
        const optionNode    = rootNode.children[0];
        const attributeList = optionNode.getAttributeList();

        expect(attributeList.length).toEqual(2);
        expect(attributeList[0].name).toEqual('${attr1}');
        expect(attributeList[0].valueList).toEqual(null);
        expect(attributeList[1].name).toEqual('${attr2}');
        expect(attributeList[1].valueList).toEqual(null);
    });

    it('lists consecutive dynamic attributes II', () => {
        const rootNode      = getTreeRootFromTemplate(16);
        const optionNode    = rootNode.children[0];
        const attributeList = optionNode.getAttributeList();

        expect(attributeList.length).toEqual(3);
        expect(attributeList[0].name).toEqual('data-gtm');
        expect(attributeList[0].value).toEqual('${gtmData}');
        expect(attributeList[1].name).toEqual('${attr1}');
        expect(attributeList[1].valueList).toEqual(null);
        expect(attributeList[2].name).toEqual('${attr2}');
        expect(attributeList[2].valueList).toEqual(null);
    });

    it('lists dynamic attributes', () => {
        const rootNode      = getTreeRootFromTemplate(17);
        const divNode       = rootNode.children[0];
        const attributeList = divNode.getAttributeList();

        expect(attributeList.length).toEqual(1);
        expect(attributeList[0].name).toContain('${pdict.order.billing.billingAddress.address');
        expect(attributeList[0].value).toEqual(null);
    });

    it('sets attributes line number', () => {
        const rootNode      = getTreeRootFromTemplate(18);
        const inputNode     = rootNode.children[0];
        const attributeList = inputNode.getAttributeList();

        expect(attributeList.length).toEqual(2);
        expect(attributeList[0].name).toContain('class');
        expect(attributeList[0].lineNumber).toEqual(2);
        expect(attributeList[1].name).toContain('required');
        expect(attributeList[1].lineNumber).toEqual(3);
    });

    it('sets attributes line numbers II', () => {
        const rootNode      = getTreeRootFromTemplate(19);
        const inputNode     = rootNode.children[0];
        const attributeList = inputNode.getAttributeList();

        expect(attributeList.length).toEqual(2);
        expect(attributeList[0].name).toContain('data-abc');
        expect(attributeList[0].value).toEqual('${require(\'int_abc\').getData(refinementValue.displayValue, \'\')}');
        expect(attributeList[0].lineNumber).toEqual(2);
        expect(attributeList[1].name).toContain('<isif condition="${!refinementValue.selectable}">disabled</isif>');
        expect(attributeList[1].value).toEqual(null);
        expect(attributeList[1].lineNumber).toEqual(3);
    });

    it('lists embedded "isprint" attribute', () => {
        const rootNode      = getTreeRootFromTemplate(20);
        const inputNode     = rootNode.children[0];
        const attributeList = inputNode.getAttributeList();

        expect(attributeList.length).toEqual(1);
        expect(attributeList[0].name).toContain('<isprint value="${form.field.attributes}" encoding="off" />');
        expect(attributeList[0].value).toEqual(null);
    });

    it('lists embedded "isprint" attribute II', () => {
        const rootNode      = getTreeRootFromTemplate(21);
        const inputNode     = rootNode.children[0];
        const attributeList = inputNode.getAttributeList();

        expect(attributeList.length).toEqual(3);
        expect(attributeList[1].name).toContain('<isprint value="${form.field.attributes}" encoding="off" />');
        expect(attributeList[1].value).toEqual(null);
    });

    it('lists attribute which value is a JSON', () => {
        const rootNode      = getTreeRootFromTemplate(22);
        const divNode       = rootNode.children[0];
        const attributeList = divNode.getAttributeList();

        expect(attributeList.length).toEqual(1);
        expect(attributeList[0].name).toEqual('data-slick');
        expect(attributeList[0].value).toEqual(`{${Constants.EOL}        "attr1": false,${Constants.EOL}        "attr2": true,${Constants.EOL}        "attr3": \${someValue}${Constants.EOL}    }`);
    });

    it('lists embedded "isif" attribute', () => {
        const rootNode      = getTreeRootFromTemplate(24);
        const divNode       = rootNode.children[0];
        const attributeList = divNode.getAttributeList();
        const valueList     = attributeList[0].valueList;

        expect(valueList.length).toEqual(3);
        expect(valueList[0]).toEqual('form-group');
        expect(valueList[1]).toEqual('<isif condition=${condition}>required</isif>');
        expect(valueList[2]).toEqual('${expressionValue}');
    });
});

const getIsmlNodeTemplatePath = number => {
    return SpecHelper.getTemplatePath(Constants.specIsmlNodeTemplateDir, number);
};

const getTreeRootFromTemplate = number => {
    const templatePath = getIsmlNodeTemplatePath(number);
    return TreeBuilder.build(templatePath, undefined, isCrlfLineBreak).rootNode;
};
