const SpecHelper  = require('../../../SpecHelper');
const TreeBuilder = require('../../../../src/isml_tree/TreeBuilder');
const Constants   = require('../../../../src/Constants');

const isCrlfLineBreak = true;

describe('TreeBuilder', () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('gets unbalanced element length', () => {
        const tree = getTreeFromTemplate(0);

        expect(tree.exception.message).toEqual('Unbalanced <isscript> element');
        expect(tree.exception.length).toEqual(10);
    });

    it('gets unbalanced element global position', () => {
        const tree = getTreeFromTemplate(0);

        expect(tree.exception.globalPos).toEqual(2);
    });

    it('gets unbalanced element length II', () => {
        const tree = getTreeFromTemplate(1);

        expect(tree.exception.length).toEqual(6);
    });

    it('gets unbalanced element global position II', () => {
        const tree = getTreeFromTemplate(1);

        expect(tree.exception.globalPos).toEqual(263);
    });

    it('gets unbalanced element length III', () => {
        const tree = getTreeFromTemplate(2);

        expect(tree.exception.length).toEqual(36);
    });

    it('gets unbalanced element global position III: root-level element', () => {
        const tree = getTreeFromTemplate(2);

        expect(tree.exception.globalPos).toEqual(97);
    });

    it('detects a closing tag without a corresponding opening tag', () => {
        const tree = getTreeFromTemplate(3);

        expect(tree.exception.globalPos).toEqual(52);
    });

    it('identifies unexpected closing element', () => {
        const tree = getTreeFromTemplate(4);

        expect(tree.exception.message).toEqual('Unexpected </span> element');
        expect(tree.exception.globalPos).toEqual(92);
    });
});

const getTemplatePath = number => {
    return SpecHelper.getTemplatePath(Constants.specElementBalanceTemplatesDir, number);
};

const getTreeFromTemplate = number => {
    const templatePath = getTemplatePath(number);
    return TreeBuilder.build(templatePath, undefined, isCrlfLineBreak);
};
