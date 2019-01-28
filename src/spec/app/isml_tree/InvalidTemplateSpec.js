const TreeBuilder    = require('../../../app/isml_tree/TreeBuilder');
const SpecHelper     = require('../../SpecHelper');
const Constants      = require('../../../app/Constants');
const ParseStatus    = require('../../../app/enums/ParseStatus');
const ExceptionUtils = require('../../../app/ExceptionUtils');

describe('Invalid Template', () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects simple unclosed <input> tag', () => {
        const result          = TreeBuilder.build(getFilePath(0));
        const expectedMessage = ExceptionUtils.getUnbalancedMessage('input', 8);

        expect(result.status).toEqual(ParseStatus.INVALID_DOM);
        expect(result.message).toEqual(expectedMessage);
    });

    it('detects simple unclosed <input> tag II', () => {
        const result          = TreeBuilder.build(getFilePath(1));
        const expectedMessage = ExceptionUtils.getUnbalancedMessage('input', 5);

        expect(result.status).toEqual(ParseStatus.INVALID_DOM);
        expect(result.message).toEqual(expectedMessage);
    });
});

const getFilePath = number => {
    return `${Constants.specInvalidTemplateDir}/template_${number}.isml`;
};
