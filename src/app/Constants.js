const path = require('path');

const clientAppDir = process.cwd();
const clientIsmlDir = path.join(clientAppDir, 'ismllinter');
const clientOutputDir = path.join(clientIsmlDir, 'output');
const clientMetadataDir = path.join(clientIsmlDir, 'metadata');

// File names;
const outputFileName = 'output.json';
const compiledOutputFileName = 'compiled_output.json';
const metadataFileName = 'metadata.json';

// Directories;
const specTempDir = path.join(clientAppDir, 'src', 'spec', 'temp');
const specFileParserTemplate = path.join(clientAppDir, 'src', 'spec', 'templates', 'default', 'file_parser');
const specLinterTemplate = path.join(clientAppDir, 'src', 'spec', 'templates', 'default', 'isml_linter');
const outputDir = 'output';
const metadataDir = 'metadata';
const rulesDir = path.join('src', 'app', 'rules');

// Regex;
const srcJsRegex = path.join('src', '**', '*.js');
const appJsRegex = path.join('src', 'app', '**', '*.js');
const specJsRegex = path.join('src', 'spec', '**', '*.js');

// File paths;
const specOutputFilePath = path.join(specTempDir, outputFileName);
const specCompiledOutputFilePath = path.join(specTempDir, compiledOutputFileName);
const specMetadataFilePath = path.join(specTempDir, metadataFileName);

// Environments;
const ENV_DEV = 'dev';
const ENV_TEST = 'test';

module.exports = {
    // Client directories;
    clientAppDir,
    clientIsmlDir,
    clientOutputDir,
    clientMetadataDir,

    // Directories;
    ismlLinterSpecDir: specLinterTemplate,
    fileParserSpecDir: specFileParserTemplate,
    specTempDir,
    outputDir,
    metadataDir,
    rulesDir,

    // File names;
    outputFileName,
    compiledOutputFileName,
    metadataFileName,

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
    ENV_TEST
};
