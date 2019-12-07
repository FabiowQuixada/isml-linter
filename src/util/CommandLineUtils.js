const parseCommand = () => {
    const commandObject = {
        options : [],
        files   : []
    };

    for (let i = 2; i < process.argv.length; i++) {
        const arg = process.argv[i];
        if (arg.startsWith('--')) {
            commandObject.options.push(arg);
        } else {
            commandObject.files.push(arg);
        }
    }

    return commandObject;
};

module.exports.parseCommand = parseCommand;
