const path                  = require('path');
const fs                    = require('fs');
const Constants             = require('../Constants');
const TreeBuilder           = require('../isml_tree/TreeBuilder');
const ConfigUtils           = require('./ConfigUtils');
const lowercaseFilenameRule = require('../rules/line_by_line/lowercase-filename');
const customTagContainer    = require('./CustomTagUtils');
const CustomModulesRule     = require('../rules/tree/custom-tags');

const lineByLineRules = [];
const treeRules       = [];

const lineRuleFileArray = fs.readdirSync(Constants.lineByLineRulesDir);
const treeRuleFileArray = fs.readdirSync(Constants.treeRulesDir);

const checkCustomTag = tag => {
    if (customTagContainer.hasOwnProperty(tag)) {
        const attrList = customTagContainer[tag].attrList;

        for (let i = 0; i < attrList.length; i++) {
            const attr = attrList[i];
            if (attr !== attr.toLowerCase()) {
                return {
                    line: '',
                    globalPos: 0,
                    length: 10,
                    lineNumber: 1,
                    rule: CustomModulesRule.name,
                    message: `Module properties need to be lower case: "${tag}" module has the invalid "${attr}" attribute`
                };
            }
        }
    }
};

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

const checkLineByLineRules = (templatePath, templateContent) => {
    const config          = ConfigUtils.load();
    const templateResults = {
        fixed  : false,
        errors : {}
    };

    const ruleArray = getEnabledLineRules();

    for (let i = 0; i < ruleArray.length; i++) {
        const rule = ruleArray[i];

        if (!rule.isIgnore(templatePath)) {
            const ruleResult = rule.check(templateContent);

            if (config.autoFix && ruleResult.fixedContent) {
                fs.writeFileSync(templatePath, ruleResult.fixedContent);
                templateResults.fixed = true;
            } else if (ruleResult.occurrences && ruleResult.occurrences.length) {
                const errorObj         = getErrorObj(rule, ruleResult.occurrences);
                templateResults.errors = Object.assign(templateResults.errors, errorObj.errors);
            }

        }
    }

    return templateResults;
};

const checkFileName = (filename, templateContent) => {
    const templateResults = {
        fixed  : false,
        errors : {}
    };

    if (lowercaseFilenameRule.isEnabled()) {
        const errorObj = lowercaseFilenameRule.check(filename, templateContent);

        if (errorObj) {
            templateResults.errors = errorObj.occurrences;
        }
    }

    return templateResults;
};

const checkTreeRules = (templatePath, templateContent) => {
    const config          = ConfigUtils.load();
    const templateResults = {
        fixed  : false,
        errors : {}
    };

    if (!config.disableTreeParse) {
        const tree = TreeBuilder.build(templatePath, templateContent);

        if (!tree.rootNode) {
            throw tree.exception;
        }

        const ruleArray = getEnabledTreeRules();

        for (let i = 0; i < ruleArray.length; i++) {
            const rule = ruleArray[i];

            if (!rule.isIgnore(templatePath)) {
                const ruleResults = rule.check(tree.rootNode, { occurrences : [] }, templateResults.data);

                if (config.autoFix && ruleResults.fixedContent) {
                    fs.writeFileSync(templatePath, ruleResults.fixedContent);
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
    const moduleResults      = {
        errors : []
    };
    moduleResults[CustomModulesRule.description];

    if (CustomModulesRule.isEnabled()) {
        for (const tag in customTagContainer) {
            const errorObj = checkCustomTag(tag);

            if (errorObj) {
                moduleResults.errors.push(errorObj);
            }
        }
    }

    return moduleResults;
};

const checkTemplate = (templatePath, content, templateName) => {
    const templateContent = content || fs.readFileSync(templatePath, 'utf-8');
    const lineResults     = checkLineByLineRules(templatePath, templateContent);
    const treeResults     = checkTreeRules(templatePath, templateContent);
    const filenameResults = checkFileName(templateName, templateContent);

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
