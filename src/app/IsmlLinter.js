const readDir           = require('readdir');
const RuleUtils         = require('./util/RuleUtils');
const path              = require('path');
const appRoot           = require('app-root-path');
const fs                = require('fs');
const config            = require('./util/ConfigUtils').load();
const ExceptionUtils    = require('./util/ExceptionUtils');
const FileUtils         = require('./util/FileUtils');
const GeneralUtils      = require('./util/GeneralUtils');
const CustomModulesRule = require('./rules/tree/custom-tags');

const UNKNOWN_ERROR = ExceptionUtils.types.UNKNOWN_ERROR;
const UNPARSEABLE   = ExceptionUtils.types.INVALID_TEMPLATE;
const Linter        = {};

const ignoreFiles = file => {
    if (file.indexOf('node_modules') !== -1) {
        return true;
    }

    if (config.ignore && config.ignore.some( ignorePath => file.indexOf(ignorePath) !== -1)) {
        return true;
    }

    return false;
};

const getTemplateData = (pathData, templateName) => {
    return {
        name : templateName,
        path : Array.isArray(pathData) || path.isAbsolute(templateName) ?
            templateName :
            path.join(pathData, templateName)};
};

const getTemplatePathArray = pathData => {
    if (Array.isArray(pathData)) {
        const result = [];

        for (let i = 0; i < pathData.length; i++) {
            const template = pathData[i];

            if (!ignoreFiles(template)) {
                result.push(template);
            }
        }

        return result;
    } else {
        if (fs.lstatSync(pathData).isFile()) {
            return [pathData];
        } else {
            const templateArray = readDir.readSync(pathData, ['**.isml']);
            const result        = [];

            for (let i = 0; i < templateArray.length; i++) {
                const template = templateArray[i];

                if (!ignoreFiles(template)) {
                    result.push(template);
                }
            }

            return result;
        }
    }
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

const reducer = (accumulator, content, templateData) => {
    const templatePath    = templateData.path;
    const templateName    = templateData.name;
    const templateResults = getEmptyResult();

    try {
        const parseResult = RuleUtils.checkTemplate(templatePath, content, templateName);

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
                templatePath : templatePath,
                message      : e.message,
                globalPos    : e.globalPos,
                length       : e.length,
                lineNumber   : e.lineNumber
            });
        }

        templateResults.issueQty++;
    }

    return templateResults;

};

Linter.run = (pathData = config.rootDir || appRoot.toString(), content) => {
    const customModuleResults = RuleUtils.checkCustomModules();
    const templatePathArray   = getTemplatePathArray(pathData);
    let finalResult           = getEmptyResult();

    for (let i = 0; i < templatePathArray.length; i++) {
        const templatePath = templatePathArray[i];
        const templateData = getTemplateData(pathData, templatePath);

        if (!FileUtils.isIgnored(templateData.path)) {
            const templateResults = reducer(finalResult, content, templateData);

            finalResult = {
                errors           : GeneralUtils.mergeDeep(finalResult.errors,    templateResults.errors),
                issueQty         : finalResult.issueQty                        + templateResults.issueQty,
                templatesFixed   : finalResult.templatesFixed                  + templateResults.templatesFixed,
                UNKNOWN_ERROR    : [...finalResult[UNKNOWN_ERROR],            ...templateResults[UNKNOWN_ERROR]],
                INVALID_TEMPLATE : [...finalResult[UNPARSEABLE],              ...templateResults[UNPARSEABLE]]
            };
        }
    }

    if (customModuleResults.errors.length) {
        finalResult.errors[CustomModulesRule.id] = customModuleResults.errors;
    }

    return finalResult;
};

module.exports = Linter;
