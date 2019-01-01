const chalk        = require('chalk');
const ConsoleUtils = require('../../app/ConsoleUtils');
const SpecHelper   = require('../SpecHelper');
const sinon        = require('sinon');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    let spy;

    beforeEach(() => {
        SpecHelper.beforeEach();
        spy = sinon.spy(console, 'log');
    });

    afterEach(() => {
        SpecHelper.afterEach();
        spy.restore();
    });


    // === Basic Linter run message ===============================================================

    it('displays linter "successful run" message when errors are not found', () => {
        ConsoleUtils.displayResult(0);

        expect(spy.firstCall.args[0]).toEqual('IsmlLinter run successfully!');
    });

    it('displays linter "successful run" message when errors are found', () => {
        ConsoleUtils.displayResult(3);

        expect(spy.firstCall.args[0]).toEqual('IsmlLinter run successfully!');
    });

    it('displays "no errors" message in green on linter run', () => {
        ConsoleUtils.displayResult(0);

        expect(spy.secondCall.args[0]).toEqual('\u001b[32mNo issues found, congrats!\u001b[39m');
    });

    it('displays "there were errors" message in red on linter run', () => {
        ConsoleUtils.displayResult(3);

        expect(spy.secondCall.args[0]).toEqual('\u001b[31mThere were 3 issues found.\u001b[39m');
    });

    it('displays "check output file" message in in blue on linter run when errors are found', () => {
        ConsoleUtils.displayResult(3);

        expect(spy.thirdCall.args[0]).toEqual('Check \u001b[34misml-linter/output/output.json\u001b[39m in your project root directory for further info.');
    });

    it('displays exception message', () => {
        ConsoleUtils.printExceptionMsg('an exception');

        const expectedResult1 = 'An error has occurred:';
        const expectedResult3 = 'If you think this is a bug, please open an issue at:';
        const expectedResult4 = '\nhttps://github.com/FabiowQuixada/isml-linter\n\n';

        expect(spy.getCall(1).args[0]).toEqual(expectedResult1);
        expect(spy.getCall(3).args[0]).toEqual(expectedResult3);
        expect(spy.getCall(4).args[0]).toEqual(expectedResult4);
    });

    it('displays build errors', () => {
        ConsoleUtils.displayErrors(expectedObject);

        const expectedResult1 = chalk.gray('13') + '\t' + chalk.red('error') + '\tWrap expression in <isprint> tag';
        const expectedResult2 = '\na_multi_cartridge_project/int_cartridge_1/templates/default/some_folder/sample_file.isml';
        const expectedResult3 = chalk.gray('39') + '\t' + chalk.red('error') + '\tWrap expression in <isprint> tag';
        const expectedResult4 = chalk.gray('59') + '\t' + chalk.red('error') + '\tWrap expression in <isprint> tag';

        expect(spy.getCall(1).args[0]).toEqual(expectedResult1);
        expect(spy.getCall(2).args[0]).toEqual(expectedResult2);
        expect(spy.getCall(3).args[0]).toEqual(expectedResult3);
        expect(spy.getCall(4).args[0]).toEqual(expectedResult4);
    });

});

const expectedObject = {
    'errors': {
        'Wrap expression in <isprint> tag': {
            'a_multi_cartridge_project/int_cartridge_1/templates/default/sample_file.isml': [
                {
                    'line': '                <a data-pid="${lineItem.productID}" class="button notifyme ${lineItem.productID}-notifyme">',
                    'lineNumber': 13,
                    'columnStart': 654,
                    'length': 21
                }
            ],
            'a_multi_cartridge_project/int_cartridge_1/templates/default/some_folder/sample_file.isml': [
                {
                    'line': '        <div class="productLineItemId">${lineItem.getUUID()}</div>',
                    'lineNumber': 39,
                    'columnStart': 2565,
                    'length': 21
                },
                {
                    'line': '            <span class="product_id_label">${Resource.msg("global.itemno", "locale", null)}</span>',
                    'lineNumber': 59,
                    'columnStart': 3197,
                    'length': 48
                }
            ]
        }
    }
};
