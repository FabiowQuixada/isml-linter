const chalk          = require('chalk');
const Constants      = require('./Constants');
const ExceptionUtils = require('./ExceptionUtils');

const displayResult = issueQty => {
    console.log('IsmlLinter run successfully!');

    if (issueQty > 0) {
        const outputPath = chalk.blue(`${Constants.ismllinterDirName}/${Constants.outputDir}/${Constants.outputFileName}`);
        console.log(chalk.red(`There were ${issueQty} issues found.`));
        console.log(`Check ${outputPath} in your project root directory for further info.`);

    } else {
        console.log(chalk.green('No issues found, congrats!'));
    }

    console.log();
};

const printExceptionMsg = e => {
    const Constants = require('./Constants');

    console.log();
    console.log('An error has occurred:');
    console.log(e.stack || e);
    console.log('If you think this is a bug, please open an issue at:');
    console.log(`\n${Constants.repositoryUrl}\n\n`);
};

const displayErrors = jsonErrors => {

    displayUnknownErrors(jsonErrors);

    let sum = 0;

    for (const rule in jsonErrors.errors) {
        for (const file in jsonErrors.errors[rule]) {
            console.log('\n' + file);

            jsonErrors.errors[rule][file].forEach( error => {
                let displayText = error.line;

                if (displayText.length > 30) {
                    displayText = displayText.substring(0, 30) + '...';
                }

                console.log(chalk.gray(error.lineNumber) + '\t' + chalk.red('error') + '\t' + rule);

                sum++;
            });
        }
    }

    console.log('\n' + chalk`{red.bold ${sum} errors found}`);
};

const displayUnknownErrors = jsonErrors => {
    const UNKNOWN_ERROR = ExceptionUtils.types.UNKNOWN_ERROR;

    if (jsonErrors[UNKNOWN_ERROR]) {
        console.log(chalk`{red.bold \nAn unexpected error happened while parsing the following files:}`);

        jsonErrors[UNKNOWN_ERROR].forEach( (filePath, i) => {
            console.log(chalk.gray(i) + '\t' + filePath);
        });

        console.log(`\nPlease report this to ${chalk.cyan(Constants.repositoryUrl)} and add these files to the ignore list while a fix is not available.`);
    }
};

module.exports = {
    displayErrors,
    displayResult,
    printExceptionMsg
};
