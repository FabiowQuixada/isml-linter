const path    = require('path');
const appRoot = require('app-root-path');
const fs      = require('fs');

// Environments;
const ENV_DEV  = 'dev';
const ENV_TEST = 'test';
const ENV_PROD = 'prod';

// File names;
const clientConfigFileName = '.ismllinter.json';
const specConfigFileName   = 'spec_config.json';

const clientAppDir    = appRoot.toString();
const productionDir   = path.join(clientAppDir, 'node_modules', 'isml-linter');
const linterModuleDir = fs.existsSync(productionDir) ? productionDir : clientAppDir;
const linterMainDir   = clientAppDir;

// Directories;
const specDir                        = path.join(linterMainDir, 'src', 'spec');
const specTempDir                    = path.join(specDir, 'temp');
const specTemplateDir                = path.join(specDir, 'templates', 'default');
const specFileParserTemplate         = path.join(specTemplateDir, 'file_parser');
const specLinterTemplate             = path.join(specTemplateDir, 'isml_linter');
const specSpecificDirLinterTemplate  = path.join(specLinterTemplate, 'specific_directory_to_be_linted');
const specIgnoreDirLinterTemplateDir = path.join(specLinterTemplate, 'ignore_config');
const specRuleTemplateDir            = path.join(specTemplateDir, 'rules');
const specIsmlTreeTemplateDir        = path.join(specTemplateDir, 'isml_tree');
const specLineNumberTemplateDir      = path.join(specIsmlTreeTemplateDir, 'line_numbers');
const specInvalidTemplateDir         = path.join(specIsmlTreeTemplateDir, 'invalid_templates');
const specComplexTemplatesDir        = path.join(specIsmlTreeTemplateDir, 'complex_templates');
const specAutofixTemplatesDir        = path.join(specTemplateDir, 'autofix');
const specIsifTagParserTemplateDir   = path.join(specTemplateDir, 'isml_tree', 'components', 'isif_tag_parser');
const rulesDir                       = path.join(linterModuleDir, 'src', 'app', 'rules');
const lineByLineRulesDir             = path.join(rulesDir, 'line_by_line');
const treeRulesDir                   = path.join(rulesDir, 'tree');

// Regex;
const srcJsRegex  = path.join('src', '**', '*.js');
const appJsRegex  = path.join('src', 'app', '**', '*.js');
const specJsRegex = path.join('src', 'spec', '**', '*.js');

// File paths;
const configFilePath = path.join(clientAppDir, clientConfigFileName);

// Links;
const repositoryUrl = 'https://github.com/FabiowQuixada/isml-linter';

// Other;
const voidElementsArray = [
    'area', 'base', 'br', 'col',
    'command', 'embed', 'hr', 'img',
    'input', 'keygen', 'link', 'meta',
    'param', 'source', 'track', 'wbr'
];

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
    lineByLineRulesDir,
    treeRulesDir,
    specRuleTemplateDir,
    specIsmlTreeTemplateDir,
    specIsifTagParserTemplateDir,
    specLineNumberTemplateDir,
    specInvalidTemplateDir,
    specComplexTemplatesDir,
    specAutofixTemplatesDir,
    specDir,

    // File names;
    clientConfigFileName,
    specConfigFileName,

    // File paths;
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
};
