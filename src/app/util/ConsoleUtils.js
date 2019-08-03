const chalk          = require('chalk');
const Constants      = require('../Constants');
const ExceptionUtils = require('./ExceptionUtils');
const ConfigUtils    = require('./ConfigUtils');

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

const displayLintingErrors = jsonErrors => {

    let partialSum = 0;
    for (const rule in jsonErrors.errors) {
        for (const template in jsonErrors.errors[rule]) {
            console.log(Constants.EOL + template);

            const errorArray = jsonErrors.errors[rule][template];

            for (let i = 0; i < errorArray.length; i++) {
                const error     = errorArray[i];
                let displayText = error.line;

                if (displayText.length > 30) {
                    displayText = displayText.substring(0, 30) + '...';
                }

                console.log(chalk.gray(error.lineNumber) + '\t' + chalk.red('error') + '\t' + rule);

                partialSum++;
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

        if (jsonErrors[INVALID_TEMPLATE]) {
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

    if (jsonErrors[UNKNOWN_ERROR]) {
        console.log(chalk`{red.bold ${Constants.EOL}An unexpected error happened while parsing the following templates:}`);

        const unknownErrorArray = jsonErrors[UNKNOWN_ERROR];

        for (let i = 0; i < unknownErrorArray.length; i++) {
            console.log(chalk.gray(i) + '\t' + unknownErrorArray[i]);
            partialSum++;
        }

        console.log(`${Constants.EOL}Please report this to ${chalk.cyan(Constants.repositoryUrl)} and add these files to the ignore list while a fix is not available.`);
    }

    return partialSum;
};

const displayErrors = jsonErrors => {

    let errorQty = 0;

    errorQty += displayUnparseableErrors(jsonErrors);
    errorQty += displayUnknownErrors(jsonErrors);
    errorQty += displayLintingErrors(jsonErrors);

    if (errorQty > 0) {
        console.log(Constants.EOL + chalk`{red.bold ${errorQty} errors found in templates.}`);
    }
};

const displayConfigError = () => {
    console.log('No configuration found. Please run the following command to create a default configuration file:');
    console.log(Constants.EOL + '\t' + chalk.yellow('node ./node_modules/.bin/isml-linter --init') + Constants.EOL);
};

module.exports = {
    displayErrors,
    displayConfigError,
    printExceptionMsg
};
