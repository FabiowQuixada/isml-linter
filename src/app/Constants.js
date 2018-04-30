const path = require('path');
const env = process.env.NODE_ENV;

// Environments;
const ENV_DEV = 'dev';
const ENV_TEST = 'test';
const ENV_PROD = 'prod';

// Directory names;
const ismllinterDirName = 'isml-linter';
const outputDir = 'output';
const metadataDir = 'metadata';

// File names;
const outputFileName = 'output.json';
const compiledOutputFileName = 'compiled_output.json';
const metadataFileName = 'metadata.json';
const clientConfigFileName = '.ismllinter.json';
const specConfigFileName = 'spec_config.json';

const clientAppDir = process.cwd();
const clientNodeModulesLinterDir = path.join(clientAppDir, 'node_modules', ismllinterDirName);
const linterMainDir = (env === ENV_PROD ? clientNodeModulesLinterDir : clientAppDir);
const clientIsmlLinterDir = path.join(clientAppDir, ismllinterDirName);
const clientOutputDir = path.join(clientIsmlLinterDir, outputDir);
const clientMetadataDir = path.join(clientIsmlLinterDir, metadataDir);

// Directories;
const specDir = path.join(linterMainDir, 'src', 'spec');
const specTempDir = path.join(specDir, 'temp');
const specTemplateDir = path.join(specDir, 'templates', 'default');
const specFileParserTemplate = path.join(specTemplateDir, 'file_parser');
const specLinterTemplate = path.join(specTemplateDir, 'isml_linter');
const specRuleTemplateDir = path.join(specTemplateDir, 'rules');
const rulesDir = path.join(linterMainDir, 'src', 'app', 'rules');

// Regex;
const srcJsRegex = path.join('src', '**', '*.js');
const appJsRegex = path.join('src', 'app', '**', '*.js');
const specJsRegex = path.join('src', 'spec', '**', '*.js');

// File paths;
const specOutputFilePath = path.join(specTempDir, outputFileName);
const specCompiledOutputFilePath = path.join(specTempDir, compiledOutputFileName);
const specMetadataFilePath = path.join(specTempDir, metadataFileName);
const configFilePath = path.join(clientAppDir, clientConfigFileName);

module.exports = {
    // Client directories;
    clientAppDir,
    clientIsmlLinterDir,
    clientOutputDir,
    clientMetadataDir,

    // Directories;
    ismlLinterSpecDir: specLinterTemplate,
    fileParserSpecDir: specFileParserTemplate,
    specTempDir,
    outputDir,
    metadataDir,
    rulesDir,
    specRuleTemplateDir,
    ismllinterDirName,
    specDir,

    // File names;
    outputFileName,
    compiledOutputFileName,
    metadataFileName,
    clientConfigFileName,
    specConfigFileName,

    // File paths;
    specOutputFilePath,
    specCompiledOutputFilePath,
    specMetadataFilePath,
    configFilePath,

    // Regex;
    srcJsRegex,
    appJsRegex,
    specJsRegex,

    // Environments;
    ENV_DEV,
    ENV_TEST,
    ENV_PROD,
};
