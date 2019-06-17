const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ParseUtils        = require('../../isml_tree/components/ParseUtils');
const Constants         = require('../../Constants');
const ConfigUtils       = require('../../util/ConfigUtils');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = 'Not eslint-valid';

const Rule = Object.create(TreeRulePrototype);

let isscriptContentArray = [];

Rule.init(ruleName, description);

Rule.addError = function(node, error, ismlIndentation, linter) {
    const errorLine              = linter.getSourceCode().lines[error.line - 1];
    const contentUpToCurrentLine = node.getValue().split(Constants.EOL, error.line - 1).join(Constants.EOL).length;
    const errorGlobalPos         = node.getGlobalPos() + contentUpToCurrentLine + ParseUtils.getNextNonEmptyCharPos(errorLine);

    this.add(
        ismlIndentation + errorLine,
        node.getLineNumber() + error.line - 3,
        errorGlobalPos,
        errorLine.trimStart().length,
        error.message
    );
};

Rule.check = function(node) {
    let eslintConfig = null;

    try {
        eslintConfig = ConfigUtils.loadEslintConfig();
    } catch (err) {
        this.add(null, 0, 0, 1, 'No eslint configuration file found.');
        return this.result;
    }

    node.children.forEach( child => this.check(child) );

    if (node.isIsscriptContent()) {
        isscriptContentArray.push(node);
    }

    if (node.isRoot()) {
        const Linter = require('eslint').Linter;
        const linter = new Linter();
        this.result  = {
            occurrences : []
        };

        isscriptContentArray.forEach( node => {
            let content = node.getValue();

            const ismlIndentation = getIndentation(content);

            content = unindent(content, ismlIndentation.length);

            const errorArray = linter.verify(content, eslintConfig);

            errorArray.forEach( error => this.addError(node, error, ismlIndentation, linter));
        });

        isscriptContentArray = [];

        return this.result;
    }
};

const unindent = (content, indentSize) => {
    return content
        .split(Constants.EOL)
        .map( line => line.substring(indentSize) )
        .join(Constants.EOL);
};

const getIndentation = content => {
    const tempContent   = content.substring(1);
    const indentSize    = ParseUtils.getNextNonEmptyCharPos(tempContent);
    let ismlIndentation = '';

    for (let i = 0; i < indentSize; i = i + 1) {
        ismlIndentation += ' ';
    }

    return ismlIndentation;
};

module.exports = Rule;
