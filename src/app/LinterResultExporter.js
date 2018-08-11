const FileUtils = require('./FileUtils');
const Constants = require('./Constants');

const outputFileName = Constants.outputFileName;
const compiledOutputFileName = Constants.compiledOutputFileName;

const LinterResultExporter = {};

LinterResultExporter.orderOutputByRuleDescription = function(jsonData) {
    const orderedOutput = {};

    Object.keys(jsonData).sort().forEach( level => {
        orderedOutput[level] = {};

        Object.keys(jsonData[level]).sort().forEach( ruleDesc => {
            orderedOutput[level][ruleDesc] = jsonData[level][ruleDesc];
        });
    });

    return orderedOutput;
};

LinterResultExporter.export = function(outputDir, jsonData) {
    const orderedJsonData = this.orderOutputByRuleDescription(jsonData);

    this.saveToFile(outputDir, orderedJsonData);
    this.compileOutput(outputDir, orderedJsonData);

    return orderedJsonData;
};

LinterResultExporter.compileOutput = function(dir, jsonData) {

    if (jsonData) {
        let total = 0;
        const compiledOutput = {};

        Object.keys(jsonData).forEach( type => {

            compiledOutput[type] = compiledOutput[type] || {};

            Object.keys(jsonData[type]).forEach( error => {
                compiledOutput[type][error] = 0;

                Object.keys(jsonData[type][error]).forEach( file => {
                    Object.keys(jsonData[type][error][file]).forEach( () => {
                        compiledOutput[type][error] += 1;
                        total += 1;
                    });
                });
            });
        });

        compiledOutput.total = total;

        FileUtils.saveToJsonFile(dir, compiledOutputFileName, compiledOutput);
    }
};

LinterResultExporter.saveToFile = function(dir, jsonData) { FileUtils.saveToJsonFile(dir, outputFileName, jsonData); };

module.exports = LinterResultExporter;
