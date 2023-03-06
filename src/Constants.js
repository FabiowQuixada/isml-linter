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
const configFileNameList       = ['ismllinter.config.js', '.ismllinter.json', '.ismllintrc.js'];
const eslintConfigFileNameList = ['.eslintrc.json', '.eslintrc.js', '.eslintrc'];

const clientAppDir    = appRoot.toString();
const productionDir   = path.join(clientAppDir, 'node_modules', 'isml-linter');
const linterModuleDir = fs.existsSync(productionDir) ? productionDir : clientAppDir;

// Directories;
const specDir                          = path.join(appRoot.toString(), 'spec');
const specTempDir                      = path.join(specDir, 'temp');
const specTemplateDir                  = path.join(specDir, 'templates', 'default');
const specFileParserTemplate           = path.join(specTemplateDir, 'file_parser');
const specLinterTemplate               = path.join(specTemplateDir, 'isml_linter');
const specSpecificDirLinterTemplate    = path.join('spec', 'templates', 'default', 'isml_linter', 'specific_directory_to_be_linted');
const specUnparseableDirLinterTemplate = path.join('spec', 'templates', 'default', 'isml_linter', 'unparseable');
const specFilenameTemplate             = path.join('spec', 'templates', 'default', 'isml_linter', 'filenames');
const specConfigTemplate               = path.join('spec', 'templates', 'default', 'config');
const specIgnoreDirLinterTemplateDir   = path.join(specLinterTemplate, 'ignore_config');
const specRuleTemplateDir              = path.join(specTemplateDir, 'rules');
const specIsmlTreeTemplateDir          = path.join(specTemplateDir, 'isml_tree');
const specIsmlNodeTemplateDir          = path.join(specTemplateDir, 'isml_node');
const specPublicApiTemplatesDir        = path.join(specTemplateDir, 'public_api');
const specLineNumberTemplateDir        = path.join(specIsmlTreeTemplateDir, 'line_numbers');
const specColumnNumberTemplateDir      = path.join(specIsmlTreeTemplateDir, 'column_number');
const specInvalidTemplateDir           = path.join(specIsmlTreeTemplateDir, 'invalid_templates');
const specGlobalPosTemplateDir         = path.join(specIsmlTreeTemplateDir, 'global_position');
const specComplexTemplatesDir          = path.join(specIsmlTreeTemplateDir, 'complex_templates');
const specElementBalanceTemplatesDir   = path.join(specIsmlTreeTemplateDir, 'element_balance');
const specTailLineNumberTemplatesDir   = path.join(specIsmlTreeTemplateDir, 'tail_line_number');
const specAutofixTemplatesDir          = path.join(specTemplateDir, 'autofix');
const specTreeRuleTemplatesDir         = path.join(specTemplateDir, 'rules', 'tree');
const rulesDir                         = path.join(linterModuleDir, 'src', 'rules');
const lineByLineRulesDir               = path.join(rulesDir, 'line_by_line');
const treeRulesDir                     = path.join(rulesDir, 'tree');

// Regex;
const srcJsRegex  = path.join('src', '**', '*.js');
const appJsRegex  = path.join('src', '**', '*.js');
const specJsRegex = path.join('spec', '**', '*.js');

// File paths;
const configFilePathList       = configFileNameList.map( fileName => path.join(clientAppDir, fileName));
const eslintConfigFilePathList = eslintConfigFileNameList.map( fileName => path.join(clientAppDir, fileName));

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
const occurrenceLevels  = {
    ERROR    : 'error',
    WARNINGS : 'warning',
    INFO     : 'info',
    toArray  : () => ['info', 'warning', 'error']
};

const leadingElementsChecking = 4;

module.exports = {
    // Client directories;
    clientAppDir,

    // Directories;
    ismlLinterSpecDir: specLinterTemplate,
    specSpecificDirLinterTemplate,
    specUnparseableDirLinterTemplate,
    specFilenameTemplate,
    specConfigTemplate,
    specIgnoreDirLinterTemplateDir,
    templateParserSpecDir: specFileParserTemplate,
    specTempDir,
    rulesDir,
    specTemplateDir,
    lineByLineRulesDir,
    treeRulesDir,
    specRuleTemplateDir,
    specPublicApiTemplatesDir,
    specIsmlTreeTemplateDir,
    specIsmlNodeTemplateDir,
    specGlobalPosTemplateDir,
    specLineNumberTemplateDir,
    specColumnNumberTemplateDir,
    specInvalidTemplateDir,
    specComplexTemplatesDir,
    specTreeRuleTemplatesDir,
    specAutofixTemplatesDir,
    specElementBalanceTemplatesDir,
    specTailLineNumberTemplatesDir,
    specDir,
    linterModuleDir,

    // File names;
    configFileNameList,
    eslintConfigFileNameList,

    // File paths;
    configFilePathList,
    eslintConfigFilePathList,

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
    occurrenceLevels,
    EOL,
    OS_EOL,
    lineBreak
};
