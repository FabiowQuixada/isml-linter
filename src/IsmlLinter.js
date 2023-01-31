const readDir        = require('readdir');
const path           = require('path');
const appRoot        = require('app-root-path');
const fs             = require('fs');
const ConfigUtils    = require('./util/ConfigUtils');
const ExceptionUtils = require('./util/ExceptionUtils');
const FileUtils      = require('./util/FileUtils');
const GeneralUtils   = require('./util/GeneralUtils');
let RuleUtils        = null;

const UNKNOWN_ERROR = ExceptionUtils.types.UNKNOWN_ERROR;
const UNPARSEABLE   = ExceptionUtils.types.INVALID_TEMPLATE;
const RULE_ERROR    = ExceptionUtils.types.RULE_ERROR;
const Linter        = {};

// Configuration set through the public API;
let globalConfig;

const ignoreFiles = file => {
    if (file.indexOf('node_modules') >= 0) {
        return true;
    }

    const config = ConfigUtils.load();

    if (config.ignore && config.ignore.some( ignorePath => file.indexOf(ignorePath) >= 0)) {
        return true;
    }

    return false;
};

const addIfNotBlacklisted = (result, templatePath) => {
    if (!ignoreFiles(templatePath)) {
        result.templates.push(templatePath);
    }
};

const getTemplatePaths = pathData => {
    const config = ConfigUtils.load();
    const result = {
        templates : [],
        notFound  : [],
        pathData  : null
    };

    pathData = pathData !== undefined && (!Array.isArray(pathData) || pathData.length > 0) ?
        pathData :
        config.rootDir || appRoot.toString();

    result.pathData = pathData;

    if (Array.isArray(pathData)) {
        for (let i = 0; i < pathData.length; i++) {
            const paramPath = pathData[i];

            if (!fs.existsSync(paramPath)) {
                result.notFound.push(paramPath);
                continue;
            }

            if (fs.lstatSync(paramPath).isFile()) {
                addIfNotBlacklisted(result, paramPath);
            } else {
                const templateArray = readDir.readSync(paramPath, ['**.isml']);

                for (let j = 0; j < templateArray.length; j++) {
                    const templatePath = path.join(paramPath, templateArray[j]);
                    addIfNotBlacklisted(result, templatePath);
                }
            }
        }
    } else {
        if (fs.lstatSync(pathData).isFile()) {
            result.templates.push(pathData);
        } else {
            const templateArray = readDir.readSync(pathData, ['**.isml']);

            for (let i = 0; i < templateArray.length; i++) {
                const templatePath = templateArray[i];
                addIfNotBlacklisted(result, templatePath);
            }
        }
    }

    return result;
};

const getEmptyResult = () => {
    return {
        errors             : {},
        warnings           : {},
        info               : {},
        UNKNOWN_ERROR      : [],
        INVALID_TEMPLATE   : [],
        RULE_ERROR         : [],
        issueQty           : 0,
        occurrenceQty      : 0,
        templatesFixed     : 0,
        totalTemplatesQty  : 0
    };
};

const parseAndPossiblyFixTemplate = (templatePath, data, content, templateName) => {
    const formattedTemplatePath = GeneralUtils.formatTemplatePath(templatePath);
    const templateResults       = getEmptyResult();

    try {
        const parseResult = RuleUtils.parseAndPossiblyFixTemplate(templatePath, data, content, templateName);

        if (parseResult.fixed) {
            templateResults.templatesFixed++;
        }

        for (const rule in parseResult.errors) {
            templateResults.errors[rule]                        = templateResults.errors[rule] || {};
            templateResults.errors[rule][formattedTemplatePath] = parseResult.errors[rule];
            templateResults.issueQty++;
            templateResults.occurrenceQty++;
        }

        for (const rule in parseResult.warnings) {
            templateResults.warnings[rule]                        = templateResults.warnings[rule] || {};
            templateResults.warnings[rule][formattedTemplatePath] = parseResult.warnings[rule];
            templateResults.occurrenceQty++;
        }

        for (const rule in parseResult.info) {
            templateResults.info[rule]                        = templateResults.info[rule] || {};
            templateResults.info[rule][formattedTemplatePath] = parseResult.info[rule];
            templateResults.occurrenceQty++;
        }
    }
    catch (e) {
        const config = ConfigUtils.load();

        if (!ExceptionUtils.isLinterException(e) || e.type === UNKNOWN_ERROR) {
            templateResults[UNKNOWN_ERROR].push(formattedTemplatePath);

            templateResults.issueQty++;
            templateResults.occurrenceQty++;

        } else if (e.type === RULE_ERROR) {
            templateResults[RULE_ERROR].push({
                templatePath  : formattedTemplatePath,
                ruleID        : e.ruleID,
                message       : e.message,
                originalError : e.originalError
            });

            templateResults.issueQty++;
            templateResults.occurrenceQty++;

        } else if (!config.ignoreUnparseable) {
            templateResults[UNPARSEABLE].push({
                templatePath : formattedTemplatePath,
                message      : e.message,
                globalPos    : e.globalPos,
                length       : e.length,
                lineNumber   : e.lineNumber
            });

            templateResults.issueQty++;
            templateResults.occurrenceQty++;
        }
    }

    return templateResults;
};

const merge = (finalResult, templateResults) => {
    return {
        errors             : GeneralUtils.mergeDeep(finalResult.errors,   templateResults.errors),
        warnings           : GeneralUtils.mergeDeep(finalResult.warnings, templateResults.warnings),
        info               : GeneralUtils.mergeDeep(finalResult.info,     templateResults.info),
        issueQty           : finalResult.issueQty                       + templateResults.issueQty,
        templatesFixed     : finalResult.templatesFixed                 + templateResults.templatesFixed,
        UNKNOWN_ERROR      : [...finalResult[UNKNOWN_ERROR],           ...templateResults[UNKNOWN_ERROR]],
        INVALID_TEMPLATE   : [...finalResult[UNPARSEABLE],             ...templateResults[UNPARSEABLE]],
        RULE_ERROR         : [...finalResult[RULE_ERROR],              ...templateResults[RULE_ERROR]],
        totalTemplatesQty  : finalResult.totalTemplatesQty
    };
};

const addCustomModuleResults = finalResult => {
    const CustomModulesRule   = require('./rules/tree/custom-tags');
    const customModuleResults = RuleUtils.checkCustomModules();
    const occurrenceGroup     = RuleUtils.getLevelGroup(CustomModulesRule.level);

    if (customModuleResults[occurrenceGroup].length) {
        finalResult[occurrenceGroup][CustomModulesRule.id] = finalResult[occurrenceGroup][CustomModulesRule.id] || {};
        // TODO: Add actual modules template path;
        finalResult[occurrenceGroup][CustomModulesRule.id]['modules.isml'] = customModuleResults[occurrenceGroup];
    }
};

Linter.setConfig = newConfig => {
    globalConfig = newConfig;
};

Linter.getConfig = () => globalConfig;

Linter.run = (pathData, content, data = {}) => {
    const ConsoleUtils = require('./util/ConsoleUtils');

    ConfigUtils.setLocalConfig(globalConfig);
    ConfigUtils.setLocalEslintConfig();

    if (!ConfigUtils.isConfigSet()) {
        ConsoleUtils.displayConfigError();
        throw ExceptionUtils.noConfigError();
    }

    RuleUtils = require('./util/RuleUtils');

    const templateData      = getTemplatePaths(pathData);
    const templatePathArray = templateData.templates;
    let finalResult         = getEmptyResult();

    if (templateData.notFound.length > 0) {
        ConsoleUtils.displayInvalidTemplatesPaths(templateData.notFound);
    }

    try {
        const lintStartTime = new Date();

        for (let i = 0; i < templatePathArray.length; i++) {
            const templateName    = templatePathArray[i];
            const templatePath    = Array.isArray(templateData.pathData) || path.isAbsolute(templateName) || templateData.pathData === templateName ?
                templateName :
                path.join(templateData.pathData, templateName);
            const shouldBeIgnored = FileUtils.shouldBeIgnored(templatePath);

            if (!shouldBeIgnored) {
                const templateResults = parseAndPossiblyFixTemplate(templatePath, data, content, templateName);

                finalResult = merge(finalResult, templateResults);
            }
        }

        addCustomModuleResults(finalResult);

        const lintEndTime             = new Date();
        finalResult.elapsedTime       = (lintEndTime.getTime() - lintStartTime.getTime()) / 1000;
        finalResult.totalTemplatesQty = templatePathArray.length;

    } catch (e) {
        ConsoleUtils.printExceptionMsg(e.stack || e);
        process.exit(1);
    }

    return finalResult;
};

module.exports = Linter;
