const reqlib = require('app-root-path').require;
const config = reqlib('/config.json');
const ResultHolder = reqlib('/src/app/ResultHolder');
const FileParser = reqlib('/src/app/FileParser');

describe('FileParser', () => {
    it('correctly parses a given ISML file', () => {
        FileParser.parse(`${config.dir.specTemplate}sample_file.isml`, ResultHolder);

        expect(ResultHolder.getOutput()).not.toEqual({});
    });
});
