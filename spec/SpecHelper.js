require('../src/app/util/NativeExtensionUtils');
// TODO: Find a better way to set this;
process.env.NODE_ENV = 'test';

const FileUtils   = require('../src/app/util/FileUtils');
const Constants   = require('../src/app/Constants');
const TreeBuilder = require('../src/app/isml_tree/TreeBuilder');
const ConfigUtils = require('../src/app/util/ConfigUtils');
const snake       = require('to-snake-case');
const path        = require('path');
const fs          = require('fs');
const eol         = require('eol');

const specTempDir = Constants.specTempDir;

const getBrokenTemplatePath = (ruleDirName, number) => {
    return `${Constants.specAutofixTemplatesDir}/rules/${ruleDirName}/template_${number}_broken.isml`;
};

const getFixedTemplatePath = (ruleDirName, number) => {
    return `${Constants.specAutofixTemplatesDir}/rules/${ruleDirName}/template_${number}_fixed.isml`;
};

const cleanTempDirectory = () => {
    FileUtils.deleteDirectoryRecursively(specTempDir);
};

const getTreeRuleSpecTemplatePath = (rule, fileNumber) => {
    return `${Constants.specRuleTemplateDir}/tree/${snake(rule.name)}/template_${fileNumber}.isml`;
};

module.exports = {
    getRule: specFileName => {
        const ruleName = specFileName.substr(0, specFileName.indexOf('-Spec'));
        const rule     = require(`../src/app/rules/line_by_line/${ruleName}`);
        return rule;
    },

    getTreeRule: specFileName => {
        const ruleName = specFileName.substr(0, specFileName.indexOf('-Spec'));
        const rule     = require(`../src/app/rules/tree/${ruleName}`);
        return rule;
    },

    beforeEach: () => {
        process.env.NODE_ENV = Constants.ENV_TEST;
        cleanTempDirectory();
    },

    afterEach: () => {
        process.env.NODE_ENV = Constants.ENV_DEV;
        cleanTempDirectory();
        ConfigUtils.clearConfig();
    },

    getRuleSpecTemplateContent: (rule, fileNumber) => {
        const fs       = require('fs');
        const filePath = `${Constants.specRuleTemplateDir}/line_by_line/${snake(rule.name)}/template_${fileNumber}.isml`;
        return fs.readFileSync(filePath, 'utf-8');
    },

    parseAndApplyRuleToTemplate: (rule, fileNumber) => {
        const filePath = getTreeRuleSpecTemplatePath(rule, fileNumber);
        const tree     = TreeBuilder.build(filePath);

        return rule.check(tree.rootNode, { occurrences : [] }, tree.data).occurrences;
    },

    getLineRuleFixData: (rule, templateNumber) => {
        const ruleDirName           = rule.name.replaceAll('-', '_');
        const brokenTemplatePath    = getBrokenTemplatePath(ruleDirName, templateNumber);
        const fixedTemplatePath     = getFixedTemplatePath(ruleDirName, templateNumber);
        const fixedTemplateContent  = fs.readFileSync(fixedTemplatePath, 'utf-8');
        const brokenTemplateContent = fs.readFileSync(brokenTemplatePath, 'utf-8');
        const actualContent         = rule.getFixedContent(brokenTemplateContent);

        return {
            actualContent,
            fixedTemplateContent
        };
    },

    getTreeRuleFixData: (rule, templateNumber) => {
        const ruleDirName          = rule.name.replaceAll('-', '_');
        const brokenTemplatePath   = getBrokenTemplatePath(ruleDirName, templateNumber);
        const fixedTemplatePath    = getFixedTemplatePath(ruleDirName, templateNumber);
        const fixedTemplateContent = fs.readFileSync(fixedTemplatePath, 'utf-8');
        const rootNode             = TreeBuilder.build(brokenTemplatePath).rootNode;
        const actualContent        = rule.getFixedContent(rootNode);

        return {
            actualContent        : eol.auto(actualContent),
            fixedTemplateContent : eol.auto(fixedTemplateContent)
        };
    },

    getEolOffset(lineNumber) {
        return (Constants.EOL.length - 1) * (lineNumber - 1);
    },

    /**
     * The name of the object under test is inferred from the spec file name. So for example: from
     * the "IsmlLinterSpec.js" file name (which is passed as param), it is implicitly inferred that
     * the object under test is "IsmlLinter". It simply removes the "Spec.js" suffix;
     */
    getTargetObjName: specFileName => {
        return path.basename(specFileName).slice(0, -7);
    }
};
