const FileUtils = require('./FileUtils');
const Constants = require('./Constants');

const outputFileName = Constants.outputFileName;
const compiledOutputFileName = Constants.compiledOutputFileName;

const LinterResultExporter = {};

const formatLine = (line, lineNumber) => `Line ${lineNumber + 1}: ${line.trim()}`;

const format = jsonData => {
    const formattedJsonData = {};

    Object.keys(jsonData).sort().forEach( level => {
        formattedJsonData[level] = {};

        Object.keys(jsonData[level]).sort().forEach( ruleDesc => {
            formattedJsonData[level][ruleDesc] = {};

            Object.keys(jsonData[level][ruleDesc]).sort().forEach( occurrence => {
                formattedJsonData[level][ruleDesc][occurrence] = [];
                const occurrenceObj = jsonData[level][ruleDesc][occurrence];

                occurrenceObj.forEach( occurrenceLine => {
                    const formattedLine = formatLine(occurrenceLine.line, occurrenceLine.lineNumber);

                    formattedJsonData[level][ruleDesc][occurrence].push(formattedLine);
                });
            });
        });
    });

    return formattedJsonData;
};

const orderOutputByRuleDescription = function(jsonData) {
    const orderedOutput = {};

    Object.keys(jsonData).sort().forEach( level => {
        orderedOutput[level] = {};

        Object.keys(jsonData[level]).sort().forEach( ruleDesc => {
            orderedOutput[level][ruleDesc] = jsonData[level][ruleDesc];
        });
    });

    return orderedOutput;
};

const compileOutput = function(dir, jsonData) {

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

    return compiledOutput;
};

/*
 * ================================================================================================
 *                                Exportable Methods Area
 * ================================================================================================
 */

LinterResultExporter.export = function(outputDir, jsonData) {
    const formattedJsonData = format(jsonData);
    const orderedJsonData = orderOutputByRuleDescription(formattedJsonData);

    FileUtils.createDirIfDoesNotExist(Constants.clientIsmlLinterDir);
    FileUtils.createDirIfDoesNotExist(Constants.clientOutputDir);
    FileUtils.saveToJsonFile(outputDir, outputFileName, jsonData);

    return compileOutput(outputDir, orderedJsonData);
};

module.exports = LinterResultExporter;
