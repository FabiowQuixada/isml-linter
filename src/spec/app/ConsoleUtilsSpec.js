const ConsoleUtils = require('../../app/ConsoleUtils');
const SpecHelper = require('../SpecHelper');
const FileParser = require('../../app/FileParser');
const sinon = require('sinon');
const rule = require('../../app/rules/IsprintTagRule');

const targetObjName = SpecHelper.getTargetObjName(__filename);
const errorType = FileParser.ENTRY_TYPES.ERROR;

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

        const expectedResult1 = 'An error has occurred.';
        const expectedResult2 = 'Please check /home/fabiow/Development/Projects/isml-linter/isml-linter/isml-linter.log for more info.';
        const expectedResult3 = 'If you think this is a bug, please open an issue at:';
        const expectedResult4 = '\nhttps://github.com/FabiowQuixada/isml-linter\n\n';

        expect(spy.getCall(1).args[0]).toEqual(expectedResult1);
        expect(spy.getCall(2).args[0]).toEqual(expectedResult2);
        expect(spy.getCall(3).args[0]).toEqual(expectedResult3);
        expect(spy.getCall(4).args[0]).toEqual(expectedResult4);
    });


    // === Error inserts and fixes ================================================================

    it('displays "new error found" message for one error', () => {
        ConsoleUtils.printNewErrorsMsg(errorType, rule, 1);

        expect(spy.firstCall.args[0]).toEqual('[errors] Wrap expression in <isprint> tag :: There is 1 new error since last run.');
    });

    it('displays "new error found" message for more than one error', () => {
        ConsoleUtils.printNewErrorsMsg(errorType, rule, 2);

        expect(spy.firstCall.args[0]).toEqual('[errors] Wrap expression in <isprint> tag :: There are 2 new errors since last run.');
    });

    it('displays "error fixed" message for one error', () => {
        ConsoleUtils.printErrorFixesMsg(errorType, rule, 1);

        expect(spy.firstCall.args[0]).toEqual('[errors] Wrap expression in <isprint> tag :: 1 error was fixed since last run!');
    });

    it('displays "error fixed" message for more than one error', () => {
        ConsoleUtils.printErrorFixesMsg(errorType, rule, 2);

        expect(spy.firstCall.args[0]).toEqual('[errors] Wrap expression in <isprint> tag :: 2 errors were fixed since last run!');
    });
});
