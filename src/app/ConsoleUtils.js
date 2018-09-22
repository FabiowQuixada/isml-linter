const chalk = require('chalk');
const Constants = require('./Constants');

const printNewErrorsMsg = (type, rule, newErrors) => {
    if (newErrors === 1) {
        console.log(`[${type}] ${rule.description} :: There is 1 new error since last run.`);
    } else {
        console.log(`[${type}] ${rule.description} :: There are ${Math.abs(newErrors)} new errors since last run.`);
    }
};

const printErrorFixesMsg = (type, rule, newFixes) => {
    if (newFixes === 1) {
        console.log(`[${type}] ${rule.description} :: 1 error was fixed since last run!`);
    } else {
        console.log(`[${type}] ${rule.description} :: ${Math.abs(newFixes)} errors were fixed since last run!`);
    }
};

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
    const fs = require('fs');

    const logFilePath = Constants.errorlogFilePath;

    fs.writeFileSync(logFilePath, e);

    console.log();
    console.log('An error has occurred.');
    console.log(`Please check ${logFilePath} for more info.`);
    console.log('If you think this is a bug, please open an issue at:');
    console.log(`\n${Constants.repositoryUrl}\n\n`);
};

module.exports = {
    displayResult,
    printNewErrorsMsg,
    printErrorFixesMsg,
    printExceptionMsg
};
