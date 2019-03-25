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
        const expectedMessage = ExceptionUtils.unbalancedElementError('input', 8).message;

        expect(result.status).toEqual(ParseStatus.INVALID_DOM);
        expect(result.message).toEqual(expectedMessage);
    });

    it('detects simple unclosed <input> tag II', () => {
        const result          = TreeBuilder.build(getFilePath(1));
        const expectedMessage = ExceptionUtils.unbalancedElementError('input', 5).message;

        expect(result.status).toEqual(ParseStatus.INVALID_DOM);
        expect(result.message).toEqual(expectedMessage);
    });

    it('identifies the line number of an unbalanced element', () => {
        const result          = TreeBuilder.build(getFilePath(2));
        const expectedMessage = ExceptionUtils.unbalancedElementError('div', 3);

        expect(result.status).toEqual(ParseStatus.INVALID_DOM);
        expect(result.message).toEqual(expectedMessage);
    });

    it('identifies the line number of an unbalanced element II', () => {
        const result          = TreeBuilder.build(getFilePath(3));
        const expectedMessage = ExceptionUtils.unbalancedElementError('select', 4).message;

        expect(result.status).toEqual(ParseStatus.INVALID_DOM);
        expect(result.message).toEqual(expectedMessage);
    });
});

const getFilePath = number => {
    return `${Constants.specInvalidTemplateDir}/template_${number}.isml`;
};
