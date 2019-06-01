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

const getTemplatePath = (pathData, templateName) => {
    return Array.isArray(pathData) || path.isAbsolute(templateName)?
        templateName :
        path.join(pathData, templateName);
};

Linter.run = function(pathData = config.rootDir || appRoot.toString(), content) {
    const filesArray = getFilePathArray(pathData);
    const result     = {
        errors   : {},
        issueQty : 0
    };

    filesArray.forEach( templateName => {
        const templatePath = getTemplatePath(pathData, templateName);

        try {
            const output = FileParser.parse(templatePath, content);

            for (const rule in output.errors) {
                result.errors[rule]               = result.errors[rule] || {};
                result.errors[rule][templatePath] = output.errors[rule];
                result.issueQty++;
            }
        } catch (e) {

            const UNKNOWN_ERROR = ExceptionUtils.types.UNKNOWN_ERROR;
            const UNPARSEABLE   = ExceptionUtils.types.INVALID_TEMPLATE;

            if (!ExceptionUtils.isLinterException(e) || e.type === UNKNOWN_ERROR) {
                result[UNKNOWN_ERROR] = result[UNKNOWN_ERROR] || [];
                result[UNKNOWN_ERROR].push(templatePath);
            } else {
                result[UNPARSEABLE] = result[UNPARSEABLE] || [];
                result[UNPARSEABLE].push({
                    filePath   : templatePath,
                    message    : e.message,
                    globalPos  : e.globalPos,
                    length     : e.length,
                    lineNumber : e.lineNumber
                });
            }

            result.issueQty++;
        }
    });

    return result;
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
