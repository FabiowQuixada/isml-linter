
// File names;
const outputFileName = 'output.json';
const compiledOutputFileName = 'compiled_output.json';
const metadataFileName = 'metadata.json';

// Directories;
const specTempDir = 'src/spec/temp/';
const specFileParserTemplate = 'src/spec/templates/file_parser/';
const specLinterTemplate = 'src/spec/templates/isml_linter/';
const outputDir = 'output/';
const metadataDir = 'metadata/';

// Regex;
const srcJsRegex = 'src/**/*.js';
const appJsRegex = 'src/app/**/*.js';
const specJsRegex = 'src/spec/**/*.js';

module.exports = {
    // Directories;
    ismlLinterSpecDir: specLinterTemplate,
    fileParserSpecDir: specFileParserTemplate,
    specTempDir: specTempDir,
    outputDir,
    metadataDir,

    // File names;
    outputFileName,
    compiledOutputFileName,
    metadataFileName,

    // File paths;
    specOutputFilePath: `${specTempDir}${outputFileName}`,
    specCompiledOutputFilePath: `${specTempDir}${compiledOutputFileName}`,
    specMetadataFilePath: `${specTempDir}${metadataFileName}`,

    // Regex;
    srcJsRegex,
    appJsRegex,
    specJsRegex
};
