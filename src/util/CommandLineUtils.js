const ConsoleUtils = require('./ConsoleUtils');

const parseCommand = () => {
    const commandObject = {
        options : [],
        files   : []
    };
    let firstFileIndex  = 2;

    for (let i = 2; i < process.argv.length; i++) {
        const arg = process.argv[i];
        if (arg.startsWith('--')) {
            commandObject.options.push(arg);
        } else {
            firstFileIndex = i;
            break;
        }
    }

    for (let i = firstFileIndex; i < process.argv.length; i++) {
        const arg = process.argv[i];
        if (!arg.startsWith('--')) {
            commandObject.files.push(arg);
        } else {
            ConsoleUtils.displayInvalidCommandError();
            return null;
        }
    }

    return commandObject;
};

module.exports.parseCommand = parseCommand;
