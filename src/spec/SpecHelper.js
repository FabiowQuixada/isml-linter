require('../app/NativeExtensionUtils');
const FileUtils   = require('../app/FileUtils');
const Constants   = require('../app/Constants');
const TreeBuilder = require('../app/isml_tree/TreeBuilder');
const snake       = require('to-snake-case');
const path        = require('path');

const specTempDir = Constants.specTempDir;

const cleanTempDirectory = () => {
    FileUtils.deleteDirectoryRecursively(specTempDir);
};

const getTreeRuleSpecTemplateContent = (rule, fileNumber) => {
    const fs       = require('fs');
    const filePath = `${Constants.specRuleTemplateDir}/tree/${snake(rule.name)}/template_${fileNumber}.isml`;
    return fs.readFileSync(filePath, 'utf-8');
};

module.exports = {
    getRule: specFileName => {
        const ruleName = specFileName.substr(0, specFileName.indexOf('-Spec'));
        const rule     = require(`../app/rules/line_by_line/${ruleName}`);
        return rule;
    },

    getTreeRule: specFileName => {
        const ruleName = specFileName.substr(0, specFileName.indexOf('-Spec'));
        const rule     = require(`../app/rules/tree/${ruleName}`);
        return rule;
    },

    beforeEach: () => {
        process.env.NODE_ENV = Constants.ENV_TEST;
        cleanTempDirectory();
    },

    afterEach: () => {
        process.env.NODE_ENV = Constants.ENV_DEV;
        cleanTempDirectory();
    },

    getRuleSpecTemplateContent: (rule, fileNumber) => {
        const fs       = require('fs');
        const filePath = `${Constants.specRuleTemplateDir}/line_by_line/${snake(rule.name)}/template_${fileNumber}.isml`;
        return fs.readFileSync(filePath, 'utf-8');
    },

    parseAndApplyRuleToTemplate: (rule, fileNumber) => {
        const fileContent = getTreeRuleSpecTemplateContent(rule, fileNumber);
        const tree        = TreeBuilder.parse(fileContent);

        return rule.check(tree).occurrences;
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
