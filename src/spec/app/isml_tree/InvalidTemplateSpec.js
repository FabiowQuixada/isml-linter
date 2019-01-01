const TreeBuilder = require('../../../app/isml_tree/TreeBuilder');
const SpecHelper  = require('../../SpecHelper');
const Constants   = require('../../../app/Constants');
const ParseStatus = require('../../../app/enums/ParseStatus');

describe('Invalid Template', () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects simple unclosed <input> tag', () => {
        const result = TreeBuilder.build(getFilePath(0));

        expect(result.status).toEqual(ParseStatus.INVALID_DOM);
        expect(result.message).toEqual('Invalid ISML DOM :: Unbalanced <input> element at line 8');
    });

    it('detects simple unclosed <input> tag II', () => {
        const result = TreeBuilder.build(getFilePath(1));

        expect(result.status).toEqual(ParseStatus.INVALID_DOM);
        expect(result.message).toEqual('Invalid ISML DOM :: Unbalanced <input> element at line 5');
    });
});

const getFilePath = number => {
    return `${Constants.specInvalidTemplateDir}/template_${number}.isml`;
};
