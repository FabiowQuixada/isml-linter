const config = require('../../../config.json');
const ResultHolder = require('../../app/ResultHolder');
const FileParser = require('../../app/FileParser');

describe('FileParser', () => {
    it('correctly parses a given ISML file', () => {
        FileParser.parse(`${config.dir.specTemplate}sample_file.isml`, ResultHolder);

        expect(ResultHolder.getOutput()).not.toEqual({});
    });
});
