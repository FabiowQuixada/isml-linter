var fs = require('fs');
const config = require('../../config.json');
const outputFilePath = `${config.dir.output}output.json`;

module.exports = {
    getRule: specFileName => {
        const ruleName = specFileName.substr(0, specFileName.indexOf('Spec'));
        const rule = require(`../app/rules/${ruleName}`);
        return rule;
    },

    deleteOutputFile: () => {
        fs.statSync(outputFilePath, () => {
            fs.unlinkSync(outputFilePath);
        });
    }
};
