const IsmlNode   = require('../../../../app/isml_tree/IsmlNode');
const SpecHelper = require('../../../SpecHelper');

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
});
