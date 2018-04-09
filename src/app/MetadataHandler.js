/**
 The MetadataHandler compares the number of errors that currently exist in the ISML files with the number
 of errors registered in the 'metadata.json' file.

 If there are more errors than registered in the metadata file, it means that new errors were introduced
 in the project, and that will be printed out in the terminal.

 If one or more errors were fixed, the metadata file will be updated so that in the next run, the reduced
 number of errors is taken into account. Fixed errors will also be printed to terminal, but will only display
 the difference relative to the last run. So if you fix an error and run the linter twice in a row, the
 "error fixed" message will display only the first time.

 */

const RulesHolder = require('./RulesHolder');
const FileUtils = require('./FileUtils');
const FileParser = require('./FileParser');
const Constants = require('./Constants');
const ConsoleUtils = require('./ConsoleUtils');
const path = require('path');

const compiledOutputFileName = Constants.compiledOutputFileName;
const metadataFileName = Constants.metadataFileName;

const updateMetadataFileRule = (newMetadata, fixedRule) => {
    const type = fixedRule.type;
    const rule = fixedRule.rule.description;
    const fixedErrors = fixedRule.fixedErrors;
    const currentErrors = newMetadata[type][rule];

    if (currentErrors > fixedErrors) {
        newMetadata[type][rule] = currentErrors - fixedErrors;
    } else {
        delete newMetadata[type][rule];
    }
};

const updateMetadataFile = (fixedRules, targetDir, originalMetadataContent) => {
    let newMetadata = Object.assign({}, originalMetadataContent);

    fixedRules.forEach( fixedRule => {
        updateMetadataFileRule(newMetadata, fixedRule);
    });

    FileUtils.saveToJsonFile(targetDir, metadataFileName, newMetadata);
};

const checkRule = (type, rule, compiledFile, metadataFile, fixedRulesArray) => {
    const compiledErrors = compiledFile[type] ? compiledFile[type][rule.description] : 0;
    const metadataErrors = metadataFile[type] ? metadataFile[type][rule.description] : 0;
    const newErrors = compiledErrors - metadataErrors;
    let isOk = true;

    if (compiledErrors !== 0 && metadataErrors !== 0) {

        if (newErrors > 0) {
            ConsoleUtils.printNewErrorsMsg(type, rule, newErrors);
            isOk = false;
        } else if (newErrors < 0) {
            ConsoleUtils.printErrorFixesMsg(type, rule, newErrors);

            fixedRulesArray.push({
                'type'        : type,
                'rule'        : rule,
                'fixedErrors' : Math.abs(newErrors)
            });
        }
    }

    return isOk;
};

const createMetadataFileIfItDoesntExist = (sourceDir, targetDir) => {
    const metadataFilePath = path.join(targetDir, metadataFileName);
    const compiledOutputContent = require(path.join(sourceDir, compiledOutputFileName));

    if (!FileUtils.fileExists(metadataFilePath)) {
        FileUtils.saveToJsonFile(targetDir, metadataFileName, compiledOutputContent);
    }
};

const updateMatadataFile = (sourceDir, targetDir) => {
    createMetadataFileIfItDoesntExist(sourceDir, targetDir);

    const originalMetadataFile = require(path.join(targetDir, metadataFileName));
    const compiledOutputFile = require(path.join(sourceDir, compiledOutputFileName));
    const types = FileParser.ENTRY_TYPES;
    const fixedRulesArray = [];
    let isOk = true;

    Object.keys(types).forEach( type => {
        RulesHolder.rules.forEach( rule => {
            isOk = isOk && checkRule(type, rule, compiledOutputFile, originalMetadataFile, fixedRulesArray);
        });
    });

    updateMetadataFile(fixedRulesArray, targetDir, originalMetadataFile);

    return isOk;
};

module.exports = {
    updateMatadataFile
};
