var fs = require('fs');
const outputFilePath = './output.json';

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
