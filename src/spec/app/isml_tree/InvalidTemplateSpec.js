const TreeBuilder    = require('../../../app/isml_tree/TreeBuilder');
const SpecHelper     = require('../../SpecHelper');
const Constants      = require('../../../app/Constants');
const ParseStatus    = require('../../../app/enums/ParseStatus');
const ExceptionUtils = require('../../../app/util/ExceptionUtils');
const ConfigUtils    = require('../../../app/util/ConfigUtils');

describe('Invalid Template', () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('detects simple unclosed <input> tag', () => {
        ConfigUtils.load({
            disableHtml5: true
        });
        const result = TreeBuilder.build(getFilePath(0));

        expect(result.status).toEqual(ParseStatus.INVALID_DOM);
        expect(result.exception.globalPos).toEqual(96);
        expect(result.exception.length).toEqual(20);
        expect(result.exception.lineNumber).toEqual(8);
        expect(result.exception.message).toEqual('Unbalanced <input> element');
    });

    it('detects simple unclosed <input> tag II', () => {
        ConfigUtils.load({
            disableHtml5: true
        });
        const result          = TreeBuilder.build(getFilePath(1));
        const expectedMessage = ExceptionUtils.unbalancedElementError('input', 5, -1, -1).message;

        expect(result.status).toEqual(ParseStatus.INVALID_DOM);
        expect(result.exception.message).toEqual(expectedMessage);
    });

    it('identifies the line number of an unbalanced element', () => {
        const templatePath = getFilePath(2);
        const result       = TreeBuilder.build(templatePath);
        const exceptionObj = ExceptionUtils.unbalancedElementError('div', 3, 95, 35, templatePath);

        expect(result.status).toEqual(ParseStatus.INVALID_DOM);
        expect(result.exception.lineNumber).toEqual(exceptionObj.lineNumber);
    });

    it('identifies the line number of an unbalanced element II', () => {
        const result          = TreeBuilder.build(getFilePath(3));
        const expectedMessage = ExceptionUtils.unbalancedElementError('select', 4, -1, -1).message;

        expect(result.status).toEqual(ParseStatus.INVALID_DOM);
        expect(result.exception.message).toEqual(expectedMessage);
    });
});

const getFilePath = number => {
    return `${Constants.specInvalidTemplateDir}/template_${number}.isml`;
};
