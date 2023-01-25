const specFileName = require('path').basename(__filename);
const SpecHelper   = require('../../../SpecHelper');
const ConfigUtils  = require('../../../../src/util/ConfigUtils');

const rule            = SpecHelper.getTreeRule(specFileName);
const isCrlfLineBreak = false;

describe('On Unix, ' + rule.id, () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('disallows void elements to have a closing tag', () => {
        ConfigUtils.load({
            rules: {
                'strict-void-element': {}
            }
        });

        const result = SpecHelper.parseAndApplyRuleToTemplate(rule, 0, isCrlfLineBreak)[0];

        expect(result.line        ).toEqual('</input>');
        expect(result.lineNumber  ).toEqual(1);
        expect(result.columnNumber).toEqual(9);
        expect(result.globalPos   ).toEqual(7);
        expect(result.length      ).toEqual(8);
        expect(result.rule        ).toEqual(rule.id);
        expect(result.message     ).toEqual('"<input>" is a void element, and as such, should not have a corresponding closing tag');
    });
});
