const path    = require('path');
const appRoot = require('app-root-path');
const fs      = require('fs');
const OS_EOL  = require('os').EOL;
const EOL     = '\n'; // Internal processing line break;

// Environments;
const ENV_DEV  = 'dev';
const ENV_TEST = 'test';
const ENV_PROD = 'prod';

// File names;
const configPreferredFileName = 'ismllinter.config.js';
const configFileName          = '.ismllinter.json';
const eslintConfigFileName    = '.eslintrc.json';
const eslintConfigFileName2   = '.eslintrc.js';

const clientAppDir    = appRoot.toString();
const productionDir   = path.join(clientAppDir, 'node_modules', 'isml-linter');
const linterModuleDir = fs.existsSync(productionDir) ? productionDir : clientAppDir;

// Directories;
const specDir                        = path.join(appRoot.toString(), 'spec');
const specTempDir                    = path.join(specDir, 'temp');
const specTemplateDir                = path.join(specDir, 'templates', 'default');
const specFileParserTemplate         = path.join(specTemplateDir, 'file_parser');
const specLinterTemplate             = path.join(specTemplateDir, 'isml_linter');
const specSpecificDirLinterTemplate  = path.join('spec', 'templates', 'default', 'isml_linter', 'specific_directory_to_be_linted');
const specFilenameTemplate           = path.join('spec', 'templates', 'default', 'isml_linter', 'filenames');
const specIgnoreDirLinterTemplateDir = path.join(specLinterTemplate, 'ignore_config');
const specRuleTemplateDir            = path.join(specTemplateDir, 'rules');
const specIsmlTreeTemplateDir        = path.join(specTemplateDir, 'isml_tree');
const specPerformanceTemplateDir     = path.join(specTemplateDir, 'performance');
const specLineNumberTemplateDir      = path.join(specIsmlTreeTemplateDir, 'line_numbers');
const specInvalidTemplateDir         = path.join(specIsmlTreeTemplateDir, 'invalid_templates');
const specGlobalPosTemplateDir       = path.join(specIsmlTreeTemplateDir, 'global_position');
const specComplexTemplatesDir        = path.join(specIsmlTreeTemplateDir, 'complex_templates');
const specElementBalanceTemplatesDir = path.join(specIsmlTreeTemplateDir, 'element_balance');
const specAutofixTemplatesDir        = path.join(specTemplateDir, 'autofix');
const specIsifTagParserTemplateDir   = path.join(specTemplateDir, 'isml_tree', 'components', 'isif_tag_parser');
const rulesDir                       = path.join(linterModuleDir, 'src', 'rules');
const lineByLineRulesDir             = path.join(rulesDir, 'line_by_line');
const treeRulesDir                   = path.join(rulesDir, 'tree');
const sampleProductionProjectName    = 'sample-production-project';
const sampleProductionProjectDir     = path.join(clientAppDir, 'scaffold_files', sampleProductionProjectName);

// Regex;
const srcJsRegex  = path.join('src', '**', '*.js');
const appJsRegex  = path.join('src', '**', '*.js');
const specJsRegex = path.join('spec', '**', '*.js');

// File paths;
const configPreferredFilePath = path.join(clientAppDir, configPreferredFileName);
const configFilePath          = path.join(clientAppDir, configFileName);
const eslintConfigFilePath    = path.join(clientAppDir, eslintConfigFileName);
const eslintConfigFilePath2   = path.join(clientAppDir, eslintConfigFileName2);

// Links;
const repositoryUrl = 'https://github.com/FabiowQuixada/isml-linter';

// Other;
const voidElementsArray = [
    'area', 'base', 'br', 'col',
    'command', 'embed', 'hr', 'img',
    'input', 'keygen', 'link', 'meta',
    'param', 'source', 'track', 'wbr'
];
const lineBreak         = {
    windows : '\r\n',
    unix    : '\n'
};

const leadingElementsChecking = 4;

module.exports = {
    // Client directories;
    clientAppDir,

    // Directories;
    ismlLinterSpecDir: specLinterTemplate,
    specSpecificDirLinterTemplate,
    specFilenameTemplate,
    specIgnoreDirLinterTemplateDir,
    templateParserSpecDir: specFileParserTemplate,
    specTempDir,
    rulesDir,
    specTemplateDir,
    lineByLineRulesDir,
    treeRulesDir,
    specRuleTemplateDir,
    specIsmlTreeTemplateDir,
    specGlobalPosTemplateDir,
    specIsifTagParserTemplateDir,
    specLineNumberTemplateDir,
    specInvalidTemplateDir,
    specPerformanceTemplateDir,
    specComplexTemplatesDir,
    specAutofixTemplatesDir,
    specElementBalanceTemplatesDir,
    specDir,
    sampleProductionProjectDir,
    sampleProductionProjectName,

    // File names;
    configPreferredFileName,
    configFileName,
    eslintConfigFileName,

    // File paths;
    configPreferredFilePath,
    configFilePath,
    eslintConfigFilePath,
    eslintConfigFilePath2,

    // Regex;
    srcJsRegex,
    appJsRegex,
    specJsRegex,

    // Environments;
    ENV_DEV,
    ENV_TEST,
    ENV_PROD,

    // Links
    repositoryUrl,

    // Other;
    voidElementsArray,
    leadingElementsChecking,
    EOL,
    OS_EOL,
    lineBreak
};
