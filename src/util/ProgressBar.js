const _cliProgress = require('cli-progress');
const _colors      = require('colors');

const progressBar = new _cliProgress.SingleBar({
    format            : '|' + _colors.cyan('{bar}') + '| {percentage}% | {value}/{total} templates',
    barCompleteChar   : '\u2588',
    barIncompleteChar : '\u2591',
    hideCursor        : true
});

module.exports = {
    start     : total => progressBar.start(total, 0),
    increment : ()    => progressBar.increment(),
    stop      : ()    => progressBar.stop()
};
