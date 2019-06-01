const RuleUtils   = require('./util/RuleUtils');
const TreeBuilder = require('./isml_tree/TreeBuilder');
const ConfigUtils = require('./util/ConfigUtils');
const fs          = require('fs');

const config = ConfigUtils.load();

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
    const templateResults = {
        errors : {}
    };

    RuleUtils
        .getEnabledLineRules()
        .filter( rule => !rule.isIgnore(filePath))
        .forEach( rule => {
            const ruleResult = rule.check(fileContent);

            if (config.autoFix && ruleResult.fixedContent) {
                fs.writeFileSync(filePath, ruleResult.fixedContent);
            } else if (ruleResult.occurrences && ruleResult.occurrences.length) {
                const errorObj         = getErrorObj(rule, ruleResult.occurrences);
                templateResults.errors = Object.assign(templateResults.errors, errorObj.errors);
            }
        });

    return templateResults;
};

const checkTreeRules = (filePath, fileContent) => {
    const templateResults = {
        errors : {}
    };

    if (!config.disableTreeParse) {
        const tree = TreeBuilder.build(filePath, fileContent);

        if (!tree.rootNode) {
            throw tree.exception;
        }

        RuleUtils
            .getEnabledTreeRules()
            .filter( rule => !rule.isIgnore(filePath))
            .forEach( rule => {
                const ruleResults = rule.check(tree.rootNode);

                if (config.autoFix && ruleResults.fixedContent) {
                    fs.writeFile(filePath, ruleResults.fixedContent);
                }
                else if (ruleResults.occurrences && ruleResults.occurrences.length) {
                    const errorObj         = getErrorObj(rule, ruleResults.occurrences);
                    templateResults.errors = Object.assign(templateResults.errors, errorObj.errors);
                }
            });
    }

    return templateResults;
};

const parse = (filePath, content) => {
    const fileContent = content || fs.readFileSync(filePath, 'utf-8');
    const lineResults = checkLineByLineRules(filePath, fileContent);
    const treeResults = checkTreeRules(filePath, fileContent);

    return {
        errors : {
            ...lineResults.errors,
            ...treeResults.errors
        }
    };
};

const FileParser = {
    parse
};

module.exports = FileParser;
