// const reqlib = require('app-root-path').require;
// const config = reqlib('/config.json');
// const IsmlLinter = reqlib('/src/app/IsmlLinter');
// const SpecHelper = reqlib('/src/spec/SpecHelper');
// const targetDir = config.dir.specLinterTemplate;
// const outputFilePath = `${require('app-root-path').toString()}/${config.dir.output}output.json`;

// describe('IsmlLinter', () => {
//     it('saves result to an output file', () => {
//         SpecHelper.deleteOutputFile();
//         IsmlLinter.lint(targetDir);
//         const actualResult = require('fs').readFileSync(outputFilePath,'utf-8');
//         const expectedResult = {};

//         expect(actualResult).toEqual(expectedResult);
//     });
// });
