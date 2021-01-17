const chalk        = require('chalk');
const sinon        = require('sinon');
const SpecHelper   = require('../../../SpecHelper');
const ConsoleUtils = require('../../../../src/util/ConsoleUtils');
const Constants    = require('../../../../src/Constants');
const ConfigUtils  = require('../../../../src/util/ConfigUtils');

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

    it('displays exception message', () => {
        ConsoleUtils.printExceptionMsg('an exception');

        const expectedResult1 = 'An error has occurred:';
        const expectedResult3 = 'If you think this is a bug, please open an issue at:';
        const expectedResult4 = `${Constants.EOL}${Constants.repositoryUrl}${Constants.EOL}${Constants.EOL}`;

        expect(spy.getCall(1).args[0]).toEqual(expectedResult1);
        expect(spy.getCall(3).args[0]).toEqual(expectedResult3);
        expect(spy.getCall(4).args[0]).toEqual(expectedResult4);
    });

    it('displays build occurrenceList', () => {
        ConfigUtils.setConfig('ignoreUnparseable', true);

        ConsoleUtils.displayOccurrenceList(expectedObject);

        const expectedResult1 = chalk.gray('13') + '\t' + chalk.red('error') + '\tWrap expression in <isprint> tag';
        const expectedResult2 = `${Constants.EOL}a_multi_cartridge_project/int_cartridge_1/templates/default/some_folder/sample_file.isml`;
        const expectedResult3 = chalk.gray('39') + '\t' + chalk.red('error') + '\tWrap expression in <isprint> tag';
        const expectedResult4 = chalk.gray('59') + '\t' + chalk.red('error') + '\tWrap expression in <isprint> tag';

        expect(spy.getCall(2).args[0]).toEqual(expectedResult1);
        expect(spy.getCall(3).args[0]).toEqual(expectedResult2);
        expect(spy.getCall(4).args[0]).toEqual(expectedResult3);
        expect(spy.getCall(5).args[0]).toEqual(expectedResult4);
    });

    it('displays invalid template errors when config is enabled', () => {

        ConfigUtils.setConfig('ignoreUnparseable', false);
        ConsoleUtils.displayOccurrenceList(expectedObject);

        //const expectedResult1 = `${chalk.grey(0)} cartridges/a_multi_cartridge_project/int_cartridge_1/templates/default/template_2.isml:289`;
        const expectedResult2 = '\t' + chalk`{red.bold >> }` + 'Unbalanced <div> element' + Constants.EOL;

        // TODO expect(spy.getCall(1).args[0]).toEqual(expectedResult1);
        expect(spy.getCall(2).args[0]).toEqual(expectedResult2);
    });

    it('does not display invalid template occurrenceList when config is disabled', () => {
        ConfigUtils.setConfig('ignoreUnparseable', true);

        ConsoleUtils.displayOccurrenceList(expectedObject);

        const expectedResult1 = chalk.gray('13') + '\t' + chalk.red('error') + '\tWrap expression in <isprint> tag';
        const expectedResult2 = Constants.EOL + 'a_multi_cartridge_project/int_cartridge_1/templates/default/some_folder/sample_file.isml';
        const expectedResult3 = chalk.gray('39') + '\t' + chalk.red('error') + '\tWrap expression in <isprint> tag';
        const expectedResult4 = chalk.gray('59') + '\t' + chalk.red('error') + '\tWrap expression in <isprint> tag';

        expect(spy.getCall(2).args[0]).toEqual(expectedResult1);
        expect(spy.getCall(3).args[0]).toEqual(expectedResult2);
        expect(spy.getCall(4).args[0]).toEqual(expectedResult3);
        expect(spy.getCall(5).args[0]).toEqual(expectedResult4);
    });

});

const expectedObject = {
    'errors': {
        'enforce-isprint': {
            'a_multi_cartridge_project/int_cartridge_1/templates/default/sample_file.isml': [
                {
                    'line': '                <a data-pid="${lineItem.productID}" class="button notifyme ${lineItem.productID}-notifyme">',
                    'lineNumber': 13,
                    'globalPos': 654,
                    'length': 21,
                    'message': 'Wrap expression in <isprint> tag'
                }
            ],
            'a_multi_cartridge_project/int_cartridge_1/templates/default/some_folder/sample_file.isml': [
                {
                    'line': '        <div class="productLineItemId">${lineItem.getUUID()}</div>',
                    'lineNumber': 39,
                    'globalPos': 2565,
                    'length': 21,
                    'message': 'Wrap expression in <isprint> tag'
                },
                {
                    'line': '            <span class="product_id_label">${Resource.msg("global.itemno", "locale", null)}</span>',
                    'lineNumber': 59,
                    'globalPos': 3197,
                    'length': 48,
                    'message': 'Wrap expression in <isprint> tag'
                }
            ]
        }
    },
    'INVALID_TEMPLATE': [{
        templatePath : 'cartridges/a_multi_cartridge_project/int_cartridge_1/templates/default/template_2.isml:289',
        message  : 'Unbalanced <div> element'
    }]
};
