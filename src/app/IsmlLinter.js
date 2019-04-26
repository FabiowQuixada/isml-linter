const readDir        = require('readdir');
const FileParser     = require('./FileParser');
const path           = require('path');
const appRoot        = require('app-root-path');
const config         = require('./util/ConfigUtils').load();
const ExceptionUtils = require('./util/ExceptionUtils');
const FileUtils      = require('./util/FileUtils');

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

    filesArray.forEach( templateName => {
        const absoluteFilePath = path.join(dir, templateName);
        const relativeFilePath = FileUtils.getRelativePath(dir, templateName);

        try {
            const output = FileParser.parse(absoluteFilePath);

            for (const rule in output.errors) {
                that.result.errors[rule]                   = that.result.errors[rule] || {};
                that.result.errors[rule][absoluteFilePath] = output.errors[rule];
                issueQty++;
            }
        } catch (e) {

            const UNKNOWN_ERROR = ExceptionUtils.types.UNKNOWN_ERROR;
            const UNPARSEABLE   = ExceptionUtils.types.INVALID_TEMPLATE;
            const fullPath      = path.join(dir, templateName);

            if (!ExceptionUtils.isLinterException(e) || e.type === UNKNOWN_ERROR) {
                that.result[UNKNOWN_ERROR] = that.result[UNKNOWN_ERROR] || [];
                that.result[UNKNOWN_ERROR].push(fullPath);
            } else {
                that.result[UNPARSEABLE] = that.result[UNPARSEABLE] || [];
                that.result[UNPARSEABLE].push({
                    filePath     : fullPath,
                    relativePath : relativeFilePath,
                    message      : e.message,
                    lineNumber   : e.lineNumber
                });
            }

            issueQty++;
        }
    });

    that.result.issueQty = issueQty;

    return that.result;
};

module.exports = Linter;
