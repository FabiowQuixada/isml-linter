const path         = require('path');
const fs           = require('fs-extra');
const rimraf       = require('rimraf');
const { execSync } = require('child_process');
const SpecHelper   = require('../SpecHelper');
const Constants    = require('../../app/Constants');

const targetDir             = path.join(Constants.clientAppDir, '..', Constants.sampleProductionProjectName);
const targetPackageBasePath = path.join(targetDir, 'package_base.json');
const targetPackagePath     = path.join(targetDir, 'package.json');

describe('Production', () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
        const { version } = require(path.join(Constants.clientAppDir, 'package.json'));
        copySampleProject();
        setProductionVersion(version);
    });

    afterEach(() => {
        SpecHelper.afterEach();
        deleteSampleProjectDir();
    });

    it('runs successfully', () => {

        const exitCode = installAndRunLinter();

        expect(exitCode).toEqual(0);
    });
});

const copySampleProject = () => {
    const sourceDir = Constants.sampleProductionProjectDir;

    fs.copySync(sourceDir, targetDir);
};

const setProductionVersion = version => {

    fs.copySync(targetPackageBasePath, targetPackagePath);

    const data   = fs.readFileSync(targetPackagePath, 'utf8');
    const result = data.replace(/{version}/g, version);

    fs.writeFileSync(targetPackagePath, result, 'utf8');
};

const installAndRunLinter = () => {

    try {
        const prodRootDir = path.join('..', Constants.sampleProductionProjectName);
        const command     = `cd ${prodRootDir} && npm run production`;

        execSync(command);

        return 0;
    } catch (err) {
        return err;
    }
};

const deleteSampleProjectDir = () => {
    rimraf.sync(targetDir);
};
