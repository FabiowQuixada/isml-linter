const path = require('path');
const env = process.env.NODE_ENV;

// Environments;
const ENV_DEV = 'dev';
const ENV_TEST = 'test';
const ENV_PROD = 'prod';

// Directory names;
const ismllinterDirName = 'isml-linter';

// File names;
const outputFileName = 'output.json';
const compiledOutputFileName = 'compiled_output.json';
const metadataFileName = 'metadata.json';
const clientConfigFileName = '.ismllinter.json';

const clientAppDir = process.cwd();
const clientNodeModulesLinterDir = path.join(clientAppDir, 'node_modules', ismllinterDirName);
const linterMainDir = (env === ENV_PROD ? clientNodeModulesLinterDir : clientAppDir);
const clientIsmlLinterDir = path.join(clientAppDir, ismllinterDirName);
const clientOutputDir = path.join(clientIsmlLinterDir, 'output');
const clientMetadataDir = path.join(clientIsmlLinterDir, 'metadata');

// Directories;
const specTempDir = path.join(linterMainDir, 'src', 'spec', 'temp');
const specFileParserTemplate = path.join(linterMainDir, 'src', 'spec', 'templates', 'default', 'file_parser');
const specLinterTemplate = path.join(linterMainDir, 'src', 'spec', 'templates', 'default', 'isml_linter');
const specRuleTemplateDir = path.join(linterMainDir, 'src', 'spec', 'templates', 'default', 'rules');
const outputDir = 'output';
const metadataDir = 'metadata';
const rulesDir = path.join(linterMainDir, 'src', 'app', 'rules');

// Regex;
const srcJsRegex = path.join('src', '**', '*.js');
const appJsRegex = path.join('src', 'app', '**', '*.js');
const specJsRegex = path.join('src', 'spec', '**', '*.js');

// File paths;
const specOutputFilePath = path.join(specTempDir, outputFileName);
const specCompiledOutputFilePath = path.join(specTempDir, compiledOutputFileName);
const specMetadataFilePath = path.join(specTempDir, metadataFileName);

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

    // File names;
    outputFileName,
    compiledOutputFileName,
    metadataFileName,
    clientConfigFileName,

    // File paths;
    specOutputFilePath,
    specCompiledOutputFilePath,
    specMetadataFilePath,

    // Regex;
    srcJsRegex,
    appJsRegex,
    specJsRegex,

    // Environments;
    ENV_DEV,
    ENV_TEST,
    ENV_PROD,
};
