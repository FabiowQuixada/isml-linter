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

const appRoot = require('app-root-path');
const reqlib = appRoot.require;
const RulesHolder = reqlib('/src/app/RulesHolder');
const FileUtils = reqlib('src/app/FileUtils');
const FileParser = reqlib('/src/app/FileParser');
const Constants = reqlib('/src/app/Constants');
const path = require('path');

const compiledOutputFileName = Constants.compiledOutputFileName;
const metadataFileName = Constants.metadataFileName;

const updateMetadataFileRule = (newMetadata, fixedRule) => {
    const type = fixedRule.type;
    const rule = fixedRule.rule.title;
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

const printNewErrorsMsg = (type, rule, newErrors) => {
    if (newErrors === 1) {
        console.log(`[${type}] ${rule.title} :: There is 1 new error since last run.`);
    } else {
        console.log(`[${type}] ${rule.title} :: There are ${Math.abs(newErrors)} new errors since last run.`);
    }
};

const printErrorFixesMsg = (type, rule, newFixes) => {
    if (newFixes === 1) {
        console.log(`[${type}] ${rule.title} :: 1 error was fixed since last run!`);
    } else {
        console.log(`[${type}] ${rule.title} :: ${Math.abs(newFixes)} errors were fixed since last run!`);
    }
};

const checkRule = (type, rule, compiledFile, metadataFile, fixedRulesArray) => {
    const compiledErrors = compiledFile[type] ? compiledFile[type][rule.title] : 0;
    const metadataErrors = metadataFile[type] ? metadataFile[type][rule.title] : 0;
    const newErrors = compiledErrors - metadataErrors;
    let isOk = true;

    if (compiledErrors !== 0 && metadataErrors !== 0) {

        if (newErrors > 0) {
            printNewErrorsMsg(type, rule, newErrors);
            isOk = false;
        } else if (newErrors < 0) {
            printErrorFixesMsg(type, rule, newErrors);

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
    const compiledOutputContent = require(`/${sourceDir}/${compiledOutputFileName}`);

    if (!FileUtils.fileExists(metadataFilePath)) {
        FileUtils.saveToJsonFile(targetDir, metadataFileName, compiledOutputContent);
    }
};

const run = (sourceDir, targetDir) => {
    createMetadataFileIfItDoesntExist(sourceDir, targetDir);

    const originalMetadataFile = require(`/${targetDir}/${metadataFileName}`);
    const compiledOutputFile = require(`/${sourceDir}/${compiledOutputFileName}`);
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
    run
};