const readDir = require('readdir');
const FileParser = require('./FileParser');
const MetadataHandler = require('./MetadataHandler');
const RulesHolder = require('./RulesHolder');
const FileUtils = require('./FileUtils');
const Constants = require('./Constants');
const path = require('path');

const lint = (linter, dir) => {
    FileParser.cleanOutput();
    const filesArray = readDir.readSync(dir, ['**.isml']);

    filesArray.forEach( fileName => {
        FileParser.parse(path.join(dir, fileName));
    });

    linter.fileParser = FileParser;
    linter.fileParser.orderOutputByRuleDescription();
};

const exportResultToFile = (linter, outputDir, metaDir) => {
    linter.fileParser.saveToFile(outputDir);
    linter.fileParser.compileOutput(outputDir);
    MetadataHandler.updateMatadataFile(outputDir, metaDir);
};

const createConfigFile = () => {
    if (!FileUtils.fileExists(path.join(Constants.clientAppDir, Constants.clientConfigFileName))) {
        const configContent = {};
        configContent.enabledRules = [];

        RulesHolder.rules.forEach( rule => {
            configContent.enabledRules.push(rule.name);
        });

        FileUtils.saveToJsonFile(Constants.clientAppDir, Constants.clientConfigFileName, configContent);
    }
};

const createClientDirectories = () => {
    FileUtils.createClientRootDir();
    FileUtils.createClientDir('output');
    FileUtils.createClientDir('metadata');
};

const init = () => {
    createClientDirectories();
    createConfigFile();
};

module.exports = {
    init,
    lint: dir => { lint(this, dir); },
    getOutput: () => this.fileParser.getOutput(),
    export: (outputDir, metaDir) => { exportResultToFile(this, outputDir, metaDir); }
};
