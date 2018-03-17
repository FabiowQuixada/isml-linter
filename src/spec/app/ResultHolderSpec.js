const appRoot = require('app-root-path');
const reqlib = appRoot.require;
const ResultHolder = reqlib('/src/app/ResultHolder');
const config = reqlib('/config.json');
const LogicInTemplateRule = reqlib('/src/app/rules/LogicInTemplateRule');
const FileUtils = reqlib('/src/app/FileUtils');

describe('ResultHolder', () => {

    const rule = LogicInTemplateRule.title;
    const fileName = 'reorder/quickreorder.isml';
    const line = '<isscript>';
    const lineNumber = 3;

    beforeEach(() => {
        ResultHolder.cleanOutput();
    });

    afterEach(() => {
        FileUtils.deleteFile(`${config.dir.specTemp}${config.file.output}`);
        FileUtils.deleteFile(`${config.dir.specTemp}${config.file.report}`);
    });

    it('adds an error to the output', () => {
        const expectedResult = expectedResultObj('errors');

        ResultHolder.addError(rule, fileName, line, lineNumber);

        expect(ResultHolder.getOutput()).toEqual(expectedResult);
    });

    it('adds a warning to the output', () => {
        const expectedResult = expectedResultObj('warnings');

        ResultHolder.addWarning(rule, fileName, line, lineNumber);

        expect(ResultHolder.getOutput()).toEqual(expectedResult);
    });

    it('adds a info to the output', () => {
        const expectedResult = expectedResultObj('info');

        ResultHolder.addInfo(rule, fileName, line, lineNumber);

        expect(ResultHolder.getOutput()).toEqual(expectedResult);
    });

    it('cleans output', () => {
        ResultHolder.cleanOutput();

        expect(ResultHolder.getOutput()).toEqual({});
    });

    it('saves output to file', () => {
        ResultHolder.addError(rule, fileName, line, lineNumber);
        ResultHolder.saveToFile(config.dir.specTemp);

        const outputFile = reqlib(`/${config.dir.specTemp}${config.file.output}`);
        const expectedResult = expectedResultObj('errors');

        expect(outputFile).toEqual(expectedResult);
    });

    it('saves linter report to file', () => {
        ResultHolder.addError(rule, fileName, line, lineNumber);
        ResultHolder.exportReport(config.dir.specTemp);

        const outputFile = reqlib(`/${config.dir.specTemp}${config.file.report}`);
        const expectedResult = expectedReportObj();

        expect(outputFile).toEqual(expectedResult);
    });

    const expectedResultObj = type => {
        let result = {};

        result[type] = {
            'Avoid putting logic into ISML' : {
                'reorder/quickreorder.isml' : [
                    'Line 3: <isscript>' ] }};

        return result;
    };

    const expectedReportObj = () => {
        return {
            'errors' : {
                'Avoid putting logic into ISML' : 1
            }
        };
    };
});
