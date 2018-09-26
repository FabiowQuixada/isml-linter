const SpecHelper = require('../SpecHelper');

const targetObjName = SpecHelper.getTargetObjName(__filename);

describe(targetObjName, () => {

    beforeEach(() => {
        SpecHelper.beforeEach();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    it('runs the linter in production mode', done => {
        const { exec } = require('child_process');

        exec('./bin/isml-linter.js', (err, stdout) => {

            const first = stdout.split('!')[0];

            expect(first).toEqual('IsmlLinter run successfully');
            done();
        });
    });
});
