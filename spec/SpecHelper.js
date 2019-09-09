require('../src/util/NativeExtensionUtils');
// TODO: Find a better way to set this;
process.env.NODE_ENV = 'test';

const FileUtils    = require('../src/util/FileUtils');
const Constants    = require('../src/Constants');
const TreeBuilder  = require('../src/isml_tree/TreeBuilder');
const ConfigUtils  = require('../src/util/ConfigUtils');
const GeneralUtils = require('../src/util/GeneralUtils');
const snake        = require('to-snake-case');
const path         = require('path');
const fs           = require('fs');

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

const getTreeRuleSpecTemplatePath = (rule, templateNumber) => {
    return `${Constants.specRuleTemplateDir}/tree/${snake(rule.id)}/template_${templateNumber}.isml`;
};

module.exports = {
    getRule: specFileName => {
        const ruleId = specFileName.substr(0, specFileName.indexOf('-Spec'));
        const rule   = require(`../src/rules/line_by_line/${ruleId}`);
        return rule;
    },

    getTreeRule: specFileName => {
        const ruleId = specFileName.substr(0, specFileName.indexOf('-Spec'));
        const rule   = require(`../src/rules/tree/${ruleId}`);
        return rule;
    },

    beforeEach: () => {
        process.env.NODE_ENV = Constants.ENV_TEST;
        ConfigUtils.load();
        cleanTempDirectory();
    },

    afterEach: () => {
        process.env.NODE_ENV = Constants.ENV_DEV;
        cleanTempDirectory();
        ConfigUtils.clearConfig();
    },

    getRuleSpecTemplateContent: (rule, templateNumber) => {
        const fs           = require('fs');
        const templatePath = `${Constants.specRuleTemplateDir}/line_by_line/${snake(rule.id)}/template_${templateNumber}.isml`;
        return fs.readFileSync(templatePath, 'utf-8');
    },

    parseAndApplyRuleToTemplate: (rule, templateNumber) => {
        const templatePath = getTreeRuleSpecTemplatePath(rule, templateNumber);
        const tree         = TreeBuilder.build(templatePath);

        return rule.check(tree.rootNode, { occurrences : [] }, tree.data).occurrences;
    },

    getLineRuleFixData: (rule, templateNumber) => {
        const ruleDirName           = rule.id.replaceAll('-', '_');
        const brokenTemplatePath    = getBrokenTemplatePath(ruleDirName, templateNumber);
        const fixedTemplatePath     = getFixedTemplatePath(ruleDirName, templateNumber);
        const fixedTemplateContent  = GeneralUtils.applyActiveLinebreaks(fs.readFileSync(fixedTemplatePath, 'utf-8'));
        const brokenTemplateContent = GeneralUtils.toLF(fs.readFileSync(brokenTemplatePath, 'utf-8'));
        const actualContent         = rule.getFixedContent(brokenTemplateContent);

        return {
            actualContent,
            fixedTemplateContent
        };
    },

    getTreeRuleFixData: (rule, templateNumber) => {
        const ruleDirName          = rule.id.replaceAll('-', '_');
        const brokenTemplatePath   = getBrokenTemplatePath(ruleDirName, templateNumber);
        const fixedTemplatePath    = getFixedTemplatePath(ruleDirName, templateNumber);
        const fixedTemplateContent = GeneralUtils.applyActiveLinebreaks(fs.readFileSync(fixedTemplatePath, 'utf-8'));
        const rootNode             = TreeBuilder.build(brokenTemplatePath).rootNode;
        const actualContent        = rule.getFixedContent(rootNode);

        return {
            actualContent,
            fixedTemplateContent
        };
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
