const readDir        = require('readdir');
const FileParser     = require('./FileParser');
const path           = require('path');
const appRoot        = require('app-root-path');
const fs             = require('fs');
const config         = require('./util/ConfigUtils').load();
const ExceptionUtils = require('./util/ExceptionUtils');
const FileUtils      = require('./util/FileUtils');

const UNKNOWN_ERROR = ExceptionUtils.types.UNKNOWN_ERROR;
const UNPARSEABLE   = ExceptionUtils.types.INVALID_TEMPLATE;
const Linter        = {};

const ignoreFiles = file => {
    if (file.indexOf('node_modules') !== -1) {
        return false;
    }

    if (config.ignore && config.ignore.some( ignorePath => file.indexOf(ignorePath) !== -1)) {
        return false;
    }

    return true;
};

const getTemplateData = (pathData, templateName) => {
    return {
        name : templateName,
        path : Array.isArray(pathData) || path.isAbsolute(templateName) ?
            templateName :
            path.join(pathData, templateName)};
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

const isObject = item => {
    return item && typeof item === 'object' && !Array.isArray(item);
};

const mergeDeep  = (target, ...sources) => {
    if (!sources.length) {
        return target;
    }

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
};

const getEmptyResult = () => {
    return {
        errors           : {},
        UNKNOWN_ERROR    : [],
        INVALID_TEMPLATE : [],
        issueQty         : 0,
        templatesFixed   : 0
    };
};

const reducer = content => {
    return (accumulator, templateData) => {
        const templatePath    = templateData.path;
        const templateName    = templateData.name;
        const templateResults = getEmptyResult();

        try {
            const parseResult = FileParser.parse(templatePath, content, templateName);

            if (parseResult.fixed) {
                templateResults.templatesFixed++;
            }

            for (const rule in parseResult.errors) {
                templateResults.errors[rule]               = templateResults.errors[rule] || {};
                templateResults.errors[rule][templatePath] = parseResult.errors[rule];
                templateResults.issueQty++;
            }
        }
        catch (e) {
            if (!ExceptionUtils.isLinterException(e) || e.type === UNKNOWN_ERROR) {
                templateResults[UNKNOWN_ERROR].push(templatePath);
            }
            else {
                templateResults[UNPARSEABLE].push({
                    filePath   : templatePath,
                    message    : e.message,
                    globalPos  : e.globalPos,
                    length     : e.length,
                    lineNumber : e.lineNumber
                });
            }

            templateResults.issueQty++;
        }

        return {
            errors           : mergeDeep(accumulator.errors,      templateResults.errors),
            issueQty         : accumulator.issueQty             + templateResults.issueQty,
            templatesFixed   : accumulator.templatesFixed       + templateResults.templatesFixed,
            UNKNOWN_ERROR    : [...accumulator[UNKNOWN_ERROR], ...templateResults[UNKNOWN_ERROR]],
            INVALID_TEMPLATE : [...accumulator[UNPARSEABLE],   ...templateResults[UNPARSEABLE]]
        };
    };
};

Linter.run = (pathData = config.rootDir || appRoot.toString(), content) => {
    return getFilePathArray(pathData)
        .map(    templateName => getTemplateData(pathData, templateName))
        .filter( templateData => !FileUtils.isIgnored(templateData.path))
        .reduce( reducer(content), getEmptyResult());
};

module.exports = Linter;
