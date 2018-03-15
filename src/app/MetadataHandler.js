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

const fs = require('fs');
const appRoot = require('app-root-path');
const reqlib = appRoot.require;
const config = reqlib('/config.json');
const RulesHolder = reqlib('/src/app/RulesHolder');
const outputFilePath = `${appRoot}/${config.dir.metadata}${config.file.metadata}`;

const saveToFile = (targetFile, content) => {
    const dir = config.dir.metadata;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    fs.writeFileSync(targetFile, JSON.stringify(content, null, 4));
};

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

const updateMetadataFile = (fixedRules, originalMetadataContent) => {
    let newMetadata = Object.assign({}, originalMetadataContent);

    fixedRules.forEach( fixedRule => {
        updateMetadataFileRule(newMetadata, fixedRule);
    });

    saveToFile(outputFilePath, newMetadata);
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

const checkRule = (type, rule, reportFile, metadataFile, fixedRulesArray) => {
    const reportErrors = reportFile[type] ? reportFile[type][rule.title] : 0;
    const metadataErrors = metadataFile[type] ? metadataFile[type][rule.title] : 0;
    const newErrors = reportErrors - metadataErrors;
    let isOk = true;

    if (reportErrors !== 0 && metadataErrors !== 0) {

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

const createMetadataFileIfItDoesntExist = () => {
    const metadataFilePath = `${config.dir.metadata}${config.file.metadata}`;
    const reportContent = reqlib(`/${config.dir.output}${config.file.report}`);

    if (!fs.existsSync(config.dir.metadata)) {
        fs.mkdirSync(config.dir.metadata);
    }

    if (!fs.existsSync(metadataFilePath)) {
        saveToFile(targetFilePath, reportContent);
    }
};

const run = () => {
    createMetadataFileIfItDoesntExist();

    const originalMetadataFile = reqlib(`/${config.dir.metadata}${config.file.metadata}`);
    const reportFile = reqlib(`/${config.dir.output}${config.file.report}`);
    const types = ['errors', 'warnings', 'info']; // TODO Centralize;
    const fixedRulesArray = [];
    let isOk = true;

    types.forEach( type => {
        RulesHolder.rules.forEach( rule => {
            isOk = isOk && checkRule(type, rule, reportFile, originalMetadataFile, fixedRulesArray);
        });
    });

    updateMetadataFile(fixedRulesArray, originalMetadataFile);

    return isOk;
};

module.exports = {
    run
};
