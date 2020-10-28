const path       = require('path');
const fs         = require('fs-extra');
const SpecHelper = require('../../SpecHelper');
const Constants  = require('../../../src/Constants');
// const IsmlLinter  = require('../../src/IsmlLinter');
const FileUtils   = require('../../../src/util/FileUtils');
// const ConfigUtils = require('../../src/util/ConfigUtils');

const TEMPLATE_QTY = 10;

describe('Performance', () => {
    beforeEach(() => {
        SpecHelper.beforeEach();
        FileUtils.createDirIfDoesNotExist(Constants.specTempDir);
        createTemporaryTemplates();
    });

    afterEach(() => {
        SpecHelper.afterEach();
    });

    // TODO
    // it('is acceptable', () => {
    //     setConfig();
    //     const startDate = new Date();

    //     const result = IsmlLinter.run(Constants.specTempDir);

    //     const endDate     = new Date();
    //     const elapsedTime = (endDate.getTime() - startDate.getTime()) / 1000;

    //     expect(result.issueQty).toEqual(TEMPLATE_QTY * 2);
    //     expect(elapsedTime).toBeGreaterThan(0.5);
    //     expect(elapsedTime).toBeLessThan(2.0);
    // });
});

const createTemporaryTemplates = () => {
    const templatePath = path.join(Constants.specPerformanceTemplateDir, 'template_0.isml');
    const content      = fs.readFileSync(templatePath, 'utf-8');

    for (let i = 0; i < TEMPLATE_QTY; i++) {
        fs.writeFileSync(
            path.join('.', 'spec', 'temp', `template_${i}.isml`),
            content);
    }
};

// const setConfig = () => {
//     ConfigUtils.load({
//         'rules': {
//             // Line by line rules;
//             'enforce-require': {},
//             'no-br': {},
//             'no-git-conflict': {},
//             'no-import-package': {},
//             'no-inline-style': {},
//             'no-isscript': {},
//             'no-space-only-lines': {},
//             'no-tabs': {},
//             'no-trailing-spaces': {},

//             // Tree rules;
//             'indent': {},
//             'max-depth': {},
//             'no-embedded-isml': {},
//             'no-hardcode': {},
//             'no-require-in-loop': {},
//             'one-element-per-line': {}
//         }
//     });
// };

