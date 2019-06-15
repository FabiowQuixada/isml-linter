const path    = require('path');
const appRoot = require('app-root-path');
const fs      = require('fs');
const EOL     = require('os').EOL;

// Environments;
const ENV_DEV  = 'dev';
const ENV_TEST = 'test';
const ENV_PROD = 'prod';

// File names;
const configPreferredFileName = 'ismllinter.config.js';
const configFileName          = '.ismllinter.json';

const clientAppDir    = appRoot.toString();
const productionDir   = path.join(clientAppDir, 'node_modules', 'isml-linter');
const linterModuleDir = fs.existsSync(productionDir) ? productionDir : clientAppDir;

// Directories;
const specDir                        = path.join(appRoot.toString(), 'src', 'spec');
const specTempDir                    = path.join(specDir, 'temp');
const specTemplateDir                = path.join(specDir, 'templates', 'default');
const specFileParserTemplate         = path.join(specTemplateDir, 'file_parser');
const specLinterTemplate             = path.join(specTemplateDir, 'isml_linter');
const specSpecificDirLinterTemplate  = path.join('src', 'spec', 'templates', 'default', 'isml_linter', 'specific_directory_to_be_linted');
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
const rulesDir                       = path.join(linterModuleDir, 'src', 'app', 'rules');
const lineByLineRulesDir             = path.join(rulesDir, 'line_by_line');
const treeRulesDir                   = path.join(rulesDir, 'tree');
const sampleProductionProjectName    = 'sample-production-project';
const sampleProductionProjectDir     = path.join(clientAppDir, 'scaffold_files', sampleProductionProjectName);

// Regex;
const srcJsRegex  = path.join('src', '**', '*.js');
const appJsRegex  = path.join('src', 'app', '**', '*.js');
const specJsRegex = path.join('src', 'spec', '**', '*.js');

// File paths;
const configPreferredFilePath = path.join(clientAppDir, configPreferredFileName);
const configFilePath          = path.join(clientAppDir, configFileName);

// Links;
const repositoryUrl = 'https://github.com/FabiowQuixada/isml-linter';

// Other;
const voidElementsArray = [
    'area', 'base', 'br', 'col',
    'command', 'embed', 'hr', 'img',
    'input', 'keygen', 'link', 'meta',
    'param', 'source', 'track', 'wbr'
];

const leadingElementsChecking = 4;

module.exports = {
    // Client directories;
    clientAppDir,

    // Directories;
    ismlLinterSpecDir: specLinterTemplate,
    specSpecificDirLinterTemplate,
    specIgnoreDirLinterTemplateDir,
    fileParserSpecDir: specFileParserTemplate,
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

    // File paths;
    configPreferredFilePath,
    configFilePath,

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
};
