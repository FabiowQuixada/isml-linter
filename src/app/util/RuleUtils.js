const path                  = require('path');
const fs                    = require('fs');
const Constants             = require('../Constants');
const TreeBuilder           = require('../isml_tree/TreeBuilder');
const ConfigUtils           = require('./ConfigUtils');
const lowercaseFilenameRule = require('../rules/line_by_line/lowercase-filename');

const lineByLineRules = [];
const treeRules       = [];

const lineRuleFileArray = fs.readdirSync(Constants.lineByLineRulesDir);
const treeRuleFileArray = fs.readdirSync(Constants.treeRulesDir);

for (let i = 0; i < lineRuleFileArray.length; i++) {
    const file = lineRuleFileArray[i];

    if (file.endsWith('.js')) {
        const rulePath = path.join(__dirname, '..', 'rules', 'line_by_line', file);
        lineByLineRules.push(require(rulePath));
    }
}

for (let i = 0; i < treeRuleFileArray.length; i++) {
    const file = treeRuleFileArray[i];

    if (file.endsWith('.js')) {
        const rulePath = path.join(__dirname, '..', 'rules', 'tree', file);
        treeRules.push(require(rulePath));
    }
}

const findNodeOfType = (node, type) => {
    let result = null;

    node.children.some( child => {
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
            rootNode.children[i] &&
            rootNode.children[i].isOfType(type);
    }

    return result;
};

const getErrorObj = (rule, occurrenceArray) => {
    const errorObj                         = {};
    errorObj[rule.level]                   = {};
    errorObj[rule.level][rule.description] = [];

    for (let i = 0; i < occurrenceArray.length; i++) {
        const occurrence = occurrenceArray[i];
        errorObj[rule.level][rule.description].push(occurrence);
    }

    return errorObj;
};

const checkLineByLineRules = (filePath, fileContent) => {
    const config          = ConfigUtils.load();
    const templateResults = {
        fixed  : false,
        errors : {}
    };

    const ruleArray = getEnabledLineRules();

    for (let i = 0; i < ruleArray.length; i++) {
        const rule = ruleArray[i];

        if (!rule.isIgnore(filePath)) {
            const ruleResult = rule.check(fileContent);

            if (config.autoFix && ruleResult.fixedContent) {
                fs.writeFileSync(filePath, ruleResult.fixedContent);
                templateResults.fixed = true;
            } else if (ruleResult.occurrences && ruleResult.occurrences.length) {
                const errorObj         = getErrorObj(rule, ruleResult.occurrences);
                templateResults.errors = Object.assign(templateResults.errors, errorObj.errors);
            }

        }
    }

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

        const ruleArray = getEnabledTreeRules();

        for (let i = 0; i < ruleArray.length; i++) {
            const rule = ruleArray[i];

            if (!rule.isIgnore(filePath)) {
                const ruleResults = rule.check(tree.rootNode, { occurrences : [] }, templateResults.data);

                if (config.autoFix && ruleResults.fixedContent) {
                    fs.writeFileSync(filePath, ruleResults.fixedContent);
                    templateResults.fixed = true;
                }
                else if (ruleResults.occurrences && ruleResults.occurrences.length) {
                    const errorObj         = getErrorObj(rule, ruleResults.occurrences);
                    templateResults.errors = Object.assign(templateResults.errors, errorObj.errors);
                }
            }
        }
    }

    return templateResults;
};

const checkCustomModules = () => {
    const customTagContainer = require('./CustomTagUtils');
    const CustomModulesRule  = require('../rules/tree/custom-tags');
    const moduleResults      = {
        errors : []
    };
    moduleResults[CustomModulesRule.description];

    if (CustomModulesRule.isEnabled()) {
        for (const tag in customTagContainer) {
            if (customTagContainer.hasOwnProperty(tag)) {
                const attrList = customTagContainer[tag].attrList;

                for (let i = 0; i < attrList.length; i++) {
                    const attr = attrList[i];

                    if (attr !== attr.toLowerCase()) {
                        moduleResults.errors.push({
                            line       : '',
                            globalPos  : 0,
                            length     : 10,
                            lineNumber : 1,
                            rule       : CustomModulesRule.name,
                            message    : `Module properties need to be lower case: "${tag}" module has the invalid "${attr}" attribute`
                        });
                    }
                }
            }
        }
    }

    return moduleResults;
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

const getAvailableRulesQty = () => treeRules.length + lineByLineRules.length;

const getEnabledLineRules = () => lineByLineRules.filter( rule => rule.isEnabled() && rule.name !== 'lowercase-filename');
const getEnabledTreeRules = () => treeRules.filter( rule => rule.isEnabled() );

module.exports.getAllLineRules             = () => lineByLineRules;
module.exports.findNodeOfType              = findNodeOfType;
module.exports.isTypeAmongTheFirstElements = isTypeAmongTheFirstElements;
module.exports.checkTemplate               = checkTemplate;
module.exports.checkCustomModules          = checkCustomModules;
module.exports.getAvailableRulesQty        = getAvailableRulesQty;
