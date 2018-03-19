const reqlib = require('app-root-path').require;
const ResultHolder = reqlib('/src/app/ResultHolder');
const FileParser = reqlib('/src/app/FileParser');
const Constants = reqlib('/src/app/Constants');

const fileParserSpecDir = Constants.fileParserSpecDir;

describe('FileParser', () => {
    it('correctly parses a given ISML file', () => {
        FileParser.parse(`${fileParserSpecDir}sample_file.isml`, ResultHolder);

        expect(ResultHolder.getOutput()).not.toEqual({});
    });
});
