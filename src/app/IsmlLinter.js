const readDir        = require('readdir');
const FileParser     = require('./FileParser');
const path           = require('path');
const Constants      = require('./Constants');
const appRoot        = require('app-root-path');
const config         = require('./ConfigLoader').load();
const ExceptionUtils = require('./ExceptionUtils');

const Linter = {};

const ignoreFiles = file => {
    if (file.indexOf('node_modules') !== -1) {
        return false;
    }

    if (config.ignore && config.ignore.some( ignorePath => file.indexOf(ignorePath) !== -1)) {
        return false;
    }

    return true;
};

Linter.run = function(dir = config.rootDir || appRoot.toString()) {

    const filesArray = readDir
        .readSync(dir, ['**.isml'])
        .filter(ignoreFiles);

    this.result        = {};
    this.result.errors = {};
    const that         = this;
    let issueQty       = 0;

    filesArray.forEach( fileProjectPath => {

        try {
            const filePath = path.join(dir, fileProjectPath);
            const output       = FileParser.parse(filePath);

            for (const rule in output.errors) {
                that.result.errors[rule]           = that.result.errors[rule] || {};
                that.result.errors[rule][filePath] = output.errors[rule];
                issueQty++;
            }
        } catch (e) {
            const UNKNOWN_ERROR = ExceptionUtils.types.UNKNOWN_ERROR;
            if (e === UNKNOWN_ERROR) {
                that.result[UNKNOWN_ERROR] = that.result[UNKNOWN_ERROR] || [];
                that.result[UNKNOWN_ERROR].push(path.join(appRoot.toString(), fileProjectPath));
            } else {
                const UNPARSEABLE                = Constants.UNPARSEABLE;
                that.result[UNPARSEABLE]         = that.result[UNPARSEABLE] || [];
                const invalidTemplate            = {};
                invalidTemplate[fileProjectPath] = e;
                that.result[UNPARSEABLE].push(invalidTemplate);
            }
            issueQty++;
        }
    });

    that.result.issueQty = issueQty;

    return that.result;
};

module.exports = Linter;
