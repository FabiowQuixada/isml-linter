const SpecHelper     = require('../../SpecHelper');
const TreeBuilder    = require('../../../src/app/isml_tree/TreeBuilder');
const Constants      = require('../../../src/app/Constants');
const ParseStatus    = require('../../../src/app/enums/ParseStatus');
const ExceptionUtils = require('../../../src/app/util/ExceptionUtils');
const ConfigUtils    = require('../../../src/app/util/ConfigUtils');

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
        const result = TreeBuilder.build(getTemplatePath(0));

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
        const result          = TreeBuilder.build(getTemplatePath(1));
        const expectedMessage = ExceptionUtils.unbalancedElementError('input', 5, -1, -1).message;

        expect(result.status).toEqual(ParseStatus.INVALID_DOM);
        expect(result.exception.message).toEqual(expectedMessage);
    });

    it('identifies the line number of an unbalanced element', () => {
        const templatePath = getTemplatePath(2);
        const result       = TreeBuilder.build(templatePath);
        const exceptionObj = ExceptionUtils.unbalancedElementError('div', 3, 95, 35, templatePath);

        expect(result.status).toEqual(ParseStatus.INVALID_DOM);
        expect(result.exception.lineNumber).toEqual(exceptionObj.lineNumber);
    });

    it('identifies the line number of an unbalanced element II', () => {
        const result          = TreeBuilder.build(getTemplatePath(3));
        const expectedMessage = ExceptionUtils.unbalancedElementError('select', 4, -1, -1).message;

        expect(result.status).toEqual(ParseStatus.INVALID_DOM);
        expect(result.exception.message).toEqual(expectedMessage);
    });
});

const getTemplatePath = number => {
    return `${Constants.specInvalidTemplateDir}/template_${number}.isml`;
};
