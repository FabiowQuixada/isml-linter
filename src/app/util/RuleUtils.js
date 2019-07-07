const path                  = require('path');
const fs                    = require('fs');
const Constants             = require('../Constants');
const TreeBuilder           = require('../isml_tree/TreeBuilder');
const ConfigUtils           = require('./ConfigUtils');
const lowercaseFilenameRule = require('../rules/line_by_line/lowercase-filename');

const lineByLineRules = [];
const treeRules       = [];

fs.readdirSync(Constants.lineByLineRulesDir)
    .filter( file => file.endsWith('.js'))
    .forEach( file => {
        const rulePath = path.join(__dirname, '..', 'rules', 'line_by_line', file);
        lineByLineRules.push(require(rulePath));
    });

fs.readdirSync(Constants.treeRulesDir)
    .filter( file => file.endsWith('.js'))
    .forEach( file => {
        const rulePath = path.join(__dirname, '..', 'rules', 'tree', file);
        treeRules.push(require(rulePath));
    });

const findNodeOfType = (node, type) => {
    let result = null;

    node.getChildren().some( child => {
        if (child.isOfType(type)) {
            result = child;
            return true;
        } else {
            result = findNodeOfType(child, type) || result;
        }

        return false;
    });

    return result;
};

const isTypeAmongTheFirstElements = (rootNode, type) => {
    let result = false;

    for (let i = 0; i < Constants.leadingElementsChecking; i++) {
        result = result ||
            rootNode.getChild(i) &&
            rootNode.getChild(i).isOfType(type);
    }

    return result;
};

const getErrorObj = (rule, occurrences) => {
    const errorObj                         = {};
    errorObj[rule.level]                   = {};
    errorObj[rule.level][rule.description] = [];

    occurrences.forEach( res => {
        errorObj[rule.level][rule.description].push(res);
    });

    return errorObj;
};

const checkLineByLineRules = (filePath, fileContent) => {
    const config          = ConfigUtils.load();
    const templateResults = {
        fixed  : false,
        errors : {}
    };

    getEnabledLineRules()
        .filter( rule => !rule.isIgnore(filePath))
        .forEach( rule => {
            const ruleResult = rule.check(fileContent);

            if (config.autoFix && ruleResult.fixedContent) {
                fs.writeFileSync(filePath, ruleResult.fixedContent);
                templateResults.fixed = true;
            } else if (ruleResult.occurrences && ruleResult.occurrences.length) {
                const errorObj         = getErrorObj(rule, ruleResult.occurrences);
                templateResults.errors = Object.assign(templateResults.errors, errorObj.errors);
            }
        });

    return templateResults;
};

const checkFileName = (filename, fileContent) => {
    const templateResults = {
        fixed  : false,
        errors : {}
    };

    if (lowercaseFilenameRule.isEnabled()) {
        const errorObj = lowercaseFilenameRule.check(filename, fileContent);

        if (errorObj) {
            templateResults.errors = errorObj.occurrences;
        }
    }

    return templateResults;
};

const checkTreeRules = (filePath, fileContent) => {
    const config          = ConfigUtils.load();
    const templateResults = {
        fixed  : false,
        errors : {}
    };

    if (!config.disableTreeParse) {
        const tree = TreeBuilder.build(filePath, fileContent);

        if (!tree.rootNode) {
            throw tree.exception;
        }

        getEnabledTreeRules()
            .filter( rule => !rule.isIgnore(filePath))
            .forEach( rule => {
                const ruleResults = rule.check(tree.rootNode, { occurrences : [] }, templateResults.data);

                if (config.autoFix && ruleResults.fixedContent) {
                    fs.writeFileSync(filePath, ruleResults.fixedContent);
                    templateResults.fixed = true;
                }
                else if (ruleResults.occurrences && ruleResults.occurrences.length) {
                    const errorObj         = getErrorObj(rule, ruleResults.occurrences);
                    templateResults.errors = Object.assign(templateResults.errors, errorObj.errors);
                }
            });
    }

    return templateResults;
};

const checkTemplate = (filePath, content, templateName) => {
    const fileContent     = content || fs.readFileSync(filePath, 'utf-8');
    const lineResults     = checkLineByLineRules(filePath, fileContent);
    const treeResults     = checkTreeRules(filePath, fileContent);
    const filenameResults = checkFileName(templateName, fileContent);

    return {
        fixed    : lineResults.fixed || treeResults.fixed,
        treeData : treeResults.data,
        errors   : {
            ...lineResults.errors,
            ...treeResults.errors,
            ...filenameResults.errors
        }
    };
};

const getEnabledLineRules = () => lineByLineRules.filter( rule => rule.isEnabled() && rule.name !== 'lowercase-filename');
const getEnabledTreeRules = () => treeRules.filter( rule => rule.isEnabled() );

module.exports.getAllLineRules             = () => lineByLineRules;
module.exports.findNodeOfType              = findNodeOfType;
module.exports.isTypeAmongTheFirstElements = isTypeAmongTheFirstElements;
module.exports.checkTemplate               = checkTemplate;
