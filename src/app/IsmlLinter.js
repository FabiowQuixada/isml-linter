const readDir        = require('readdir');
const FileParser     = require('./FileParser');
const path           = require('path');
const appRoot        = require('app-root-path');
const fs             = require('fs');
const config         = require('./util/ConfigUtils').load();
const ExceptionUtils = require('./util/ExceptionUtils');

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

Linter.run = function(pathData = config.rootDir || appRoot.toString()) {
    const filesArray = getFilePathArray(pathData);

    this.result        = {};
    this.result.errors = {};
    const that         = this;
    let issueQty       = 0;

    filesArray.forEach( templateName => {
        const absoluteFilePath = Array.isArray(pathData) ? templateName : path.join(pathData, templateName);
        const filePath         = Array.isArray(pathData) ? templateName : path.join(pathData, templateName);

        try {
            const output = FileParser.parse(absoluteFilePath);

            for (const rule in output.errors) {
                that.result.errors[rule]           = that.result.errors[rule] || {};
                that.result.errors[rule][filePath] = output.errors[rule];
                issueQty++;
            }
        } catch (e) {

            const UNKNOWN_ERROR = ExceptionUtils.types.UNKNOWN_ERROR;
            const UNPARSEABLE   = ExceptionUtils.types.INVALID_TEMPLATE;

            if (!ExceptionUtils.isLinterException(e) || e.type === UNKNOWN_ERROR) {
                that.result[UNKNOWN_ERROR] = that.result[UNKNOWN_ERROR] || [];
                that.result[UNKNOWN_ERROR].push(filePath);
            } else {
                that.result[UNPARSEABLE] = that.result[UNPARSEABLE] || [];
                that.result[UNPARSEABLE].push({
                    filePath   : filePath,
                    message    : e.message,
                    lineNumber : e.lineNumber
                });
            }

            issueQty++;
        }
    });

    that.result.issueQty = issueQty;

    return that.result;
};

const getFilePathArray = pathData => {
    if (Array.isArray(pathData)) {
        return pathData.filter(ignoreFiles);
    } else {
        if (fs.lstatSync(pathData).isFile()) {
            return [pathData];
        } else {
            return readDir
                .readSync(pathData, ['**.isml'])
                .filter(ignoreFiles);
        }
    }
};

module.exports = Linter;
