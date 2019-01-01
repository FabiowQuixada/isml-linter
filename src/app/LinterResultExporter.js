const FileUtils = require('./FileUtils');
const Constants = require('./Constants');
const config    = require('./ConfigLoader').load();

const outputFileName         = Constants.outputFileName;
const compiledOutputFileName = Constants.compiledOutputFileName;

const LinterResultExporter = {};

const formatLine = (line, lineNumber) => `Line ${lineNumber + 1}: ${line.trim()}`;

const format = jsonData => {
    const formattedJsonData = {};

    Object.keys(jsonData).sort().forEach( level => {

        if (level === 'errors') {
            formattedJsonData[level] = {};
            Object.keys(jsonData[level]).sort().forEach( ruleDesc => {
                formattedJsonData[level][ruleDesc] = {};

                Object.keys(jsonData[level][ruleDesc]).sort().forEach( occurrence => {
                    formattedJsonData[level][ruleDesc][occurrence] = [];
                    const occurrenceObj                            = jsonData[level][ruleDesc][occurrence];

                    occurrenceObj.forEach( occurrenceLine => {
                        const formattedLine = formatLine(occurrenceLine.line, occurrenceLine.lineNumber);

                        formattedJsonData[level][ruleDesc][occurrence].push(formattedLine);
                    });
                });
            });
        } else if (level === Constants.UNPARSEABLE) {
            formattedJsonData[level] = [];

            jsonData[level].forEach( occurrence => {
                formattedJsonData[level].push(occurrence);
            });
        }
    });

    return formattedJsonData;
};

const orderOutputByRuleDescription = function(jsonData) {
    const orderedOutput = {};

    Object.keys(jsonData).sort().forEach( level => {
        if (level === 'errors') {
            orderedOutput[level] = {};

            Object.keys(jsonData[level]).sort().forEach( ruleDesc => {
                orderedOutput[level][ruleDesc] = jsonData[level][ruleDesc];
            });
        } else if (level === Constants.UNPARSEABLE) {
            orderedOutput[level] = jsonData[level].sort();
        }
    });

    return orderedOutput;
};

const compileOutput = function(dir, jsonData) {

    const compiledOutput = {};
    let total            = 0;

    Object.keys(jsonData).forEach( type => {

        Object.keys(jsonData[type]).forEach( error => {
            compiledOutput[type]        = compiledOutput[type] || {};
            compiledOutput[type][error] = 0;

            if (type !== Constants.UNPARSEABLE) {
                Object.keys(jsonData[type][error]).forEach( file => {
                    Object.keys(jsonData[type][error][file]).forEach( () => {
                        compiledOutput[type][error] += 1;
                        total                       += 1;
                    });
                });
            } else {
                compiledOutput[type] = 0;
                jsonData[type].forEach( () => {

                    compiledOutput[type] += 1;

                    if (!config.ignoreUnparseable) {
                        total += 1;
                    }
                });
            }
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
    const orderedJsonData   = orderOutputByRuleDescription(formattedJsonData);

    FileUtils.createDirIfDoesNotExist(Constants.clientIsmlLinterDir);
    FileUtils.createDirIfDoesNotExist(Constants.clientOutputDir);
    FileUtils.saveToJsonFile(outputDir, outputFileName, jsonData);

    return compileOutput(outputDir, orderedJsonData);
};

module.exports = LinterResultExporter;
