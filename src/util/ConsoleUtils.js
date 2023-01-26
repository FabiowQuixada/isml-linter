const chalk          = require('chalk');
const Constants      = require('../Constants');
const ExceptionUtils = require('./ExceptionUtils');
const ConfigUtils    = require('./ConfigUtils');

const MAX_LISTED_ERRORS = 30;

const printExceptionMsg = e => {
    if (!e.isCustom) {
        console.log();
        console.log('An error has occurred:');
        console.log(e.stack || e);
        console.log('If you think this is a bug, please open an issue at:');
        console.log(`${Constants.EOL}${Constants.repositoryUrl}${Constants.EOL}${Constants.EOL}`);
    }
};

const displayLintingOccurrenceList = lintResult => {

    const config           = ConfigUtils.load();
    const occurrenceLevels = Constants.occurrenceLevels.toArray();
    const errorData        = getErrorsData(lintResult);
    const warningData      = getWarningsData(lintResult);
    const infoData         = getInfoData(lintResult);

    const data = {
        error : {
            messages : errorData.outputMsgList,
            qty      : errorData.qty
        },
        warning : {
            messages : warningData.outputMsgList,
            qty      : warningData.qty
        },
        info : {
            messages : infoData.outputMsgList,
            qty      : infoData.qty
        },
        total : errorData.qty + warningData.qty + infoData.qty
    };

    for (let j = 0; j < occurrenceLevels.length; j++) {
        const occurrenceGroup = occurrenceLevels[j];

        if (data[occurrenceGroup].qty > 0) {
            for (let i = 0; i < data[occurrenceGroup].messages.length; i++) {
                if (config.printPartialResults && i > MAX_LISTED_ERRORS) {
                    break;
                }
                console.log(data[occurrenceGroup].messages[i]);
            }
        }
    }

    return data;
};

const displayUnparseableErrors = lintResult => {

    const config   = ConfigUtils.load();
    let partialSum = 0;

    if (!config.ignoreUnparseable) {

        const INVALID_TEMPLATE = ExceptionUtils.types.INVALID_TEMPLATE;

        if (lintResult[INVALID_TEMPLATE] && lintResult[INVALID_TEMPLATE].length > 0) {
            console.log(chalk`{red.bold ${Constants.EOL}An Isml abstract syntax tree could not be built for the following templates:}`);

            for (let i = 0; i < lintResult[INVALID_TEMPLATE].length; i++) {
                if (config.printPartialResults && i > MAX_LISTED_ERRORS) {
                    break;
                }

                const error = lintResult[INVALID_TEMPLATE][i];
                console.log(chalk.gray(i) + ' ' + error.templatePath + ':' + error.lineNumber);
                console.log('\t' + chalk`{red.bold >> }` + `${error.message}${Constants.EOL}`);
                partialSum++;
            }
        }
    }

    return partialSum;
};

const displayRuleErrors = lintResult => {

    const RULE_ERROR = ExceptionUtils.types.RULE_ERROR;
    const config     = ConfigUtils.load();
    let partialSum   = 0;

    if (lintResult[RULE_ERROR] && lintResult[RULE_ERROR].length > 0) {
        console.log(chalk`{red.bold ${Constants.EOL}An unexpected error occurred while applying rules to the following templates:}`);

        for (let i = 0; i < lintResult[RULE_ERROR].length; i++) {
            if (config.printPartialResults && i > MAX_LISTED_ERRORS) {
                break;
            }

            const error = lintResult[RULE_ERROR][i];
            console.log(chalk.gray(i) + '\t' + error.ruleID + ' :\t' + error.templatePath);
            partialSum++;
        }
    }

    return partialSum;
};

const displayUnknownErrors = lintResult => {
    const UNKNOWN_ERROR = ExceptionUtils.types.UNKNOWN_ERROR;
    let partialSum      = 0;

    if (lintResult[UNKNOWN_ERROR] && lintResult[UNKNOWN_ERROR].length > 0) {
        console.log(chalk`{red.bold ${Constants.EOL}An unexpected error happened while parsing the following templates:}`);

        const unknownErrorArray = lintResult[UNKNOWN_ERROR];

        for (let i = 0; i < unknownErrorArray.length; i++) {
            console.log(chalk.gray(i) + '\t' + unknownErrorArray[i]);
            partialSum++;
        }

        console.log(`${Constants.EOL}Please check if your node version is >=10.0.0. If it is, please report the above issues to ${chalk.cyan(Constants.repositoryUrl + '/issues')} and add these files to the ignore list while a fix is not available.`);
    }

    return partialSum;
};

const getPluralTermString = (singularTerm, qty) => `${qty} ${singularTerm}${qty > 1 ? 's' : ''}`;

const displayOccurrenceList = lintResult => {

    displayUnparseableErrors(lintResult);
    displayUnknownErrors(lintResult);
    displayRuleErrors(lintResult);

    // TODO Add this 'config' as a global const;
    const config         = ConfigUtils.load();
    const occurrenceList = displayLintingOccurrenceList(lintResult);

    const isThereAnyOccurrence = occurrenceList.error.qty > 0 ||
        occurrenceList.warning.qty > 0 ||
        occurrenceList.info.qty > 0 ||
        lintResult.INVALID_TEMPLATE && lintResult.INVALID_TEMPLATE.length > 0 ||
        lintResult.UNKNOWN_ERROR && lintResult.UNKNOWN_ERROR.length > 0;

    if (isThereAnyOccurrence) {

        console.log(Constants.EOL + '=====================================================');
        console.log(Constants.EOL + chalk`{bold Linted ${lintResult.totalTemplatesQty} templates in ${lintResult.elapsedTime} seconds.}`);

        if (occurrenceList.error.qty > 0) {
            console.log(chalk`{bold ${getPluralTermString('error', occurrenceList.error.qty)} found.}`);
        }

        if (occurrenceList.warning.qty > 0) {
            console.log(chalk`{bold ${getPluralTermString('warning', occurrenceList.warning.qty)} found.}`);
        }

        if (occurrenceList.info.qty > 0) {
            console.log(chalk`{bold ${getPluralTermString('info', occurrenceList.info.qty)} found.}`);
        }

        if (lintResult.INVALID_TEMPLATE && lintResult.INVALID_TEMPLATE.length > 0) {
            console.log(chalk`{bold ${getPluralTermString('template', lintResult.INVALID_TEMPLATE.length)} have an invalid ISML tree.}`);
        }

        if (lintResult.UNKNOWN_ERROR && lintResult.UNKNOWN_ERROR.length > 0) {
            if (lintResult.UNKNOWN_ERROR.length > 1) {
                console.log(chalk`{bold There were ${lintResult.UNKNOWN_ERROR.length} unknown errors while parsing templates.}`);
            } else {
                console.log(chalk`{bold There was 1 unknown error while parsing templates.}`);
            }
        }

        if (config.printPartialResults) {
            console.log(chalk`{bold Displaying the first ${MAX_LISTED_ERRORS} occurrences of each group.}` + Constants.EOL);
        }
    }
};

const displayInvalidTemplatesPaths = templatePathArray => {
    console.log(Constants.EOL + chalk`{red.bold Could not find the following templates:}`);

    for (let i = 0; i < templatePathArray.length; i++) {
        const invalidPath = templatePathArray[i];
        console.log(chalk.gray(i) + '\t' + invalidPath);
    }

    console.log(Constants.EOL);
};

const displayConfigError = () => {
    console.log('No configuration found. Please run the following command to create a default configuration file:');
    console.log(Constants.EOL + '\t' + chalk.yellow('./node_modules/.bin/isml-linter --init') + Constants.EOL);
};

const displayInvalidCommandError = () => {
    console.log('\nInvalid command detected. Please use the following format:');
    console.log(Constants.EOL + '\t' + chalk.yellow('./node_modules/.bin/isml-linter [options] [file|dir]*') + Constants.EOL);
    console.log('For example:');
    console.log(Constants.EOL + '\t' + chalk.yellow('./node_modules/.bin/isml-linter --autofix template1.isml directory1/ directory2/') + Constants.EOL);
};

const displayEslintConfigError = () => {
    const config               = ConfigUtils.load();
    const eslintConfigFileName = config.eslintConfig;

    console.log(`The "eslint-to-isscript" rule is enabled, but an ESLint configuration file ${eslintConfigFileName ? '"' + eslintConfigFileName  + '" ' : ''}could not be found in the project root directory.'`);
};

const getErrorsData = lintResult => {
    const outputMsgList = [];
    let qty             = 0;

    outputMsgList.push(chalk`{red.bold ${Constants.EOL}The following linting errors were found in the templates:}`);

    for (const rule in lintResult.errors) {
        for (const template in lintResult.errors[rule]) {
            outputMsgList.push(Constants.EOL + template);

            const occurrenceList = lintResult.errors[rule][template];

            for (let i = 0; i < occurrenceList.length; i++) {
                const occurrence  = occurrenceList[i];

                outputMsgList.push(
                    chalk.gray(occurrence.lineNumber) + '\t' +
                        chalk.red('error') + '\t' +
                        occurrence.message
                );

                qty++;
            }
        }
    }

    return {
        outputMsgList,
        qty
    };
};

const getWarningsData = lintResult => {
    const outputMsgList = [];
    let qty             = 0;

    outputMsgList.push(chalk`{yellow.bold ${Constants.EOL}The following linting warnings were found in the templates:}`);

    for (const rule in lintResult.warnings) {
        for (const template in lintResult.warnings[rule]) {
            outputMsgList.push(Constants.EOL + template);

            const occurrenceList = lintResult.warnings[rule][template];

            for (let i = 0; i < occurrenceList.length; i++) {
                const occurrence  = occurrenceList[i];

                outputMsgList.push(
                    chalk.gray(occurrence.lineNumber) + '\t' +
                        chalk.yellow('warning') + '\t' +
                        occurrence.message
                );

                qty++;
            }
        }
    }

    return {
        outputMsgList,
        qty
    };
};

const getInfoData = lintResult => {
    const outputMsgList = [];
    let qty             = 0;

    outputMsgList.push(chalk`{cyan.bold ${Constants.EOL}The following linting info items were found in the templates:}`);

    for (const rule in lintResult.info) {
        for (const template in lintResult.info[rule]) {
            outputMsgList.push(Constants.EOL + template);

            const occurrenceList = lintResult.info[rule][template];

            for (let i = 0; i < occurrenceList.length; i++) {
                const occurrence  = occurrenceList[i];

                outputMsgList.push(
                    chalk.gray(occurrence.lineNumber) + '\t' +
                        chalk.cyan('info') + '\t' +
                        occurrence.message
                );

                qty++;
            }
        }
    }

    return {
        outputMsgList,
        qty
    };
};

const displayVerboseMessage = (message, depth = 0) => {
    const config    = ConfigUtils.load();
    let indentation = '';

    for (let i = 0; i < depth; i++) {
        indentation += '    ';
    }

    if (config.verbose) {
        console.log(indentation + message);
    }
};

module.exports = {
    displayOccurrenceList,
    displayConfigError,
    displayEslintConfigError,
    displayInvalidTemplatesPaths,
    displayInvalidCommandError,
    printExceptionMsg,
    displayVerboseMessage
};
