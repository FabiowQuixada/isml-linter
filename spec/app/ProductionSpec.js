// const path         = require('path');
// const fs           = require('fs-extra');
// const rimraf       = require('rimraf');
// const { execSync } = require('child_process');
// const SpecHelper   = require('../SpecHelper');
// const Constants    = require('../../src/Constants');
// const ConfigUtils  = require('../../src/util/ConfigUtils');

// const targetDir             = path.join(Constants.clientAppDir, '..', Constants.sampleProductionProjectName);
// const targetPackageBasePath = path.join(targetDir, 'package_base.json');
// const targetPackagePath     = path.join(targetDir, 'package.json');

// describe('Production', () => {
//     beforeEach(() => {
//         deleteSampleProjectDir();
//         const { version } = require(path.join(Constants.clientAppDir, 'package.json'));
//         copySampleProject();
//         setProductionVersion(version);
//         installLinter();
//         SpecHelper.beforeEach();
//     });

//     afterEach(() => {
//         removeConfigs();
//         SpecHelper.afterEach();
//         deleteSampleProjectDir();
//     });

//     it('runs successfully if a configuration is set', () => {
//         initConfig();

//         const exitCode = runLinter();

//         expect(exitCode).toEqual(0);
//     });
// });

// const copySampleProject = () => {
//     const sourceDir = Constants.sampleProductionProjectDir;

//     fs.copySync(sourceDir, targetDir);
// };

// const setProductionVersion = version => {

//     fs.copySync(targetPackageBasePath, targetPackagePath);

//     const data   = fs.readFileSync(targetPackagePath, 'utf8');
//     const result = data.replace(/{version}/g, version);

//     fs.writeFileSync(targetPackagePath, result, 'utf8');
// };

// const installLinter = () => {
//     return runCommand('npm run import');
// };

// const initConfig = () => {
//     return runCommand('npm run init:isml');
// };

// const runLinter = () => {
//     return runCommand('npm run lint');
// };

// const removeConfigs = () => {
//     rimraf.sync(path.join(targetDir, Constants.configPreferredFileName));
//     rimraf.sync(path.join(targetDir, Constants.configFileName));
//     ConfigUtils.clearConfig();
//     ConfigUtils.clearEslintConfig();
// };

// const deleteSampleProjectDir = () => {
//     rimraf.sync(targetDir);
// };

// const runCommand = inputCommand => {
//     try {
//         const prodRootDir = path.join('..', Constants.sampleProductionProjectName);
//         const command     = `cd ${prodRootDir} && ${inputCommand}`;

//         execSync(command);

//         return 0;
//     } catch (err) {
//         return err;
//     }
// };
