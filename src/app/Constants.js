
// File names;
const outputFileName = 'output.json';
const reportFileName = 'report.json';
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
    reportFileName,
    metadataFileName,

    // File paths;
    specOutputFilePath: `${specTempDir}${outputFileName}`,
    specReportFilePath: `${specTempDir}${reportFileName}`,
    specMetadataFilePath: `${specTempDir}${metadataFileName}`,

    // Regex;
    srcJsRegex,
    appJsRegex,
    specJsRegex
};
