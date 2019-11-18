const chalk          = require('chalk');
const Constants      = require('../Constants');
const ExceptionUtils = require('./ExceptionUtils');
const ConfigUtils    = require('./ConfigUtils');

const MAX_LISTED_ERRORS = 100;

const printExceptionMsg = e => {
    const Constants = require('../Constants');

    if (!e.isCustom) {
        console.log();
        console.log('An error has occurred:');
        console.log(e.stack || e);
        console.log('If you think this is a bug, please open an issue at:');
        console.log(`${Constants.EOL}${Constants.repositoryUrl}${Constants.EOL}${Constants.EOL}`);
    }
};

const printLintingError = (error, partialSum, rule) => {
    let displayText = error.line;

    if (displayText.length > 30) {
        displayText = displayText.substring(0, 30) + '...';
    }

    if (partialSum < MAX_LISTED_ERRORS) {
        console.log(chalk.gray(error.lineNumber) + '\t' + chalk.red('error') + '\t' + rule);
    }
};

const displayLintingErrors = jsonErrors => {

    let partialSum = 0;

    if (jsonErrors.errors && Object.keys(jsonErrors.errors).length > 0) {
        console.log(chalk`{red.bold ${Constants.EOL}The following linting errors were found in the templates:}`);

        for (const rule in jsonErrors.errors) {
            for (const template in jsonErrors.errors[rule]) {
                if (partialSum < MAX_LISTED_ERRORS) {
                    console.log(Constants.EOL + template);
                }

                const errorArray = jsonErrors.errors[rule][template];

                for (let i = 0; i < errorArray.length; i++) {
                    printLintingError(errorArray[i], partialSum, rule);
                    partialSum++;
                }
            }
        }
    }

    return partialSum;
};

const displayUnparseableErrors = jsonErrors => {

    const config   = ConfigUtils.load();
    let partialSum = 0;

    if (!config.ignoreUnparseable) {

        const INVALID_TEMPLATE = ExceptionUtils.types.INVALID_TEMPLATE;

        if (jsonErrors[INVALID_TEMPLATE] && jsonErrors[INVALID_TEMPLATE].length > 0) {
            console.log(chalk`{red.bold ${Constants.EOL}An Isml abstract syntax tree could not be built for the following templates:}`);

            for (let i = 0; i < jsonErrors[INVALID_TEMPLATE].length; i++) {
                const error = jsonErrors[INVALID_TEMPLATE][i];
                console.log(chalk.gray(i) + ' ' + error.templatePath + ':' + error.lineNumber);
                console.log('\t' + chalk`{red.bold >> }` + `${error.message}${Constants.EOL}`);
                partialSum++;
            }
        }
    }

    return partialSum;
};

const displayUnknownErrors = jsonErrors => {
    const UNKNOWN_ERROR = ExceptionUtils.types.UNKNOWN_ERROR;
    let partialSum      = 0;

    if (jsonErrors[UNKNOWN_ERROR] && jsonErrors[UNKNOWN_ERROR].length > 0) {
        console.log(chalk`{red.bold ${Constants.EOL}An unexpected error happened while parsing the following templates:}`);

        const unknownErrorArray = jsonErrors[UNKNOWN_ERROR];

        for (let i = 0; i < unknownErrorArray.length; i++) {
            console.log(chalk.gray(i) + '\t' + unknownErrorArray[i]);
            partialSum++;
        }

        console.log(`${Constants.EOL}Please check if your node version is >=10.0.0. If it is, please report the above issues to ${chalk.cyan(Constants.repositoryUrl)} and add these files to the ignore list while a fix is not available.`);
    }

    return partialSum;
};

const displayErrors = jsonErrors => {

    let errorQty = 0;

    errorQty         += displayUnparseableErrors(jsonErrors);
    errorQty         += displayUnknownErrors(jsonErrors);
    const lintErrors = displayLintingErrors(jsonErrors);
    errorQty         += lintErrors;

    if (errorQty > 0) {
        console.log(Constants.EOL + chalk`{red.bold ${errorQty} errors found in templates.}`);

        if (lintErrors >= MAX_LISTED_ERRORS) {
            console.log(chalk`{red.bold Displaying the first ${MAX_LISTED_ERRORS} errors.}` + Constants.EOL);
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
    const eslintConfigFileName = config.eslintConfig || '.eslintrc.json';

    console.log(`The "eslint-to-isscript" rule is enabled, but an ESLint configuration "${eslintConfigFileName}" file could not be found in the project root directory.`);
};

module.exports = {
    displayErrors,
    displayConfigError,
    displayEslintConfigError,
    displayInvalidTemplatesPaths,
    displayInvalidCommandError,
    printExceptionMsg
};
