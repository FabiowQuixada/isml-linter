const fs = require('fs');
const reqlib = require('app-root-path').require;
const config = reqlib('/config.json');
const outputFilePath = `${require('app-root-path').toString()}/${config.dir.output}output.json`;

module.exports = {
    getRule: specFileName => {
        const ruleName = specFileName.substr(0, specFileName.indexOf('Spec'));
        const rule = reqlib(`/src/app/rules/${ruleName}`);
        return rule;
    },

    deleteOutputFile: () => {
        fs.statSync(outputFilePath, () => {
            fs.unlinkSync(outputFilePath);
        });
    }
};
