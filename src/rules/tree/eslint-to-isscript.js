const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ParseUtils        = require('../../isml_tree/ParseUtils');
const Constants         = require('../../Constants');
const ConfigUtils       = require('../../util/ConfigUtils');

const ruleId          = require('path').basename(__filename).slice(0, -3);
const description     = 'Not eslint-valid';
const notFoundMessage = 'No eslint configuration file found: ' + ConfigUtils.getEslintConfigFilePath();

const Rule = Object.create(TreeRulePrototype);

let isscriptContentArray = [];

Rule.init(ruleId, description);

Rule.addError = function(node, eslintError, ismlOffset, linter, data) {
    const errorLine = linter.getSourceCode() ?
        linter.getSourceCode().lines[eslintError.line - 1] :
        node.head.split('\n')[eslintError.line - 1];

    const duplicatedOffset = ParseUtils.getNextNonEmptyCharPos(node.head);
    const errorLocalPos    = node.head.indexOf(errorLine.trimStart()) - duplicatedOffset;
    let errorGlobalPos     = node.globalPos;
    let columnNumber       = node.columnNumber;
    let length             = errorLine.trimStart().length;
    let message;

    errorGlobalPos += data.isCrlfLineBreak ?
        errorLocalPos + eslintError.line - 2 :
        node.head.trimStart().indexOf(errorLine.trimStart());

    if (eslintError.ruleId === 'indent') {
        length         = getIndentErrorLength(eslintError, ismlOffset);
        message        = getIsmlIdentMessage(eslintError, ismlOffset);
        errorGlobalPos -= length;
        columnNumber   = length + 1;

    } else {
        message = eslintError.message;
    }

    const error = this.getError(
        ismlOffset + errorLine,
        node.lineNumber + eslintError.line - 2,
        columnNumber,
        errorGlobalPos,
        length,
        message
    );

    return error;
};

Rule.check = function(node, data) {
    let eslintConfig = null;

    try {
        eslintConfig = ConfigUtils.loadEslintConfig();
    } catch (err) {
        const error = this.getError(null, 0, 1, 0, 1, notFoundMessage);
        return { occurrenceList : [error] };
    }

    this.checkChildren(node, data);

    if (node.isIsscriptContent()) {
        isscriptContentArray.push(node);
    }

    if (node.isRoot()) {
        const ESLinter       = require('eslint').Linter;
        const ruleConfig     = this.getConfigs();
        const eslinter       = new ESLinter();
        const occurrenceList = [];

        for (let index = 0; index < isscriptContentArray.length; index++) {
            const jsContentNode = isscriptContentArray[index];
            let content         = jsContentNode.head;

            const ismlOffset = getIsmlOffset(jsContentNode);

            content = unindent(content, ismlOffset.length);

            const errorArray = eslinter.verify(content, eslintConfig);

            for (let i = 0; i < errorArray.length; i++) {
                const error = this.addError(jsContentNode, errorArray[i], ismlOffset, eslinter, data);
                occurrenceList.push(error);
            }
        }

        isscriptContentArray = [];

        return this.return(node, occurrenceList, ruleConfig);
    }
};

Rule.getFixedContent = function(node) {
    let eslintConfig = null;

    try {
        eslintConfig = ConfigUtils.loadEslintConfig();
    } catch (err) {
        const error = this.getError(null, 0, 1, 0, 1, notFoundMessage);
        return { occurrenceList : [error] };
    }

    for (let i = 0; i < node.children.length; i++) {
        this.getFixedContent(node.children[i]);
    }

    if (node.isIsscriptContent()) {
        const Linter     = require('eslint').Linter;
        const linter     = new Linter();
        let content      = node.head;
        const ismlOffset = getIsmlOffset(node);

        this.result.fixedContent = content = linter.verifyAndFix(content, eslintConfig).output;

        node.head = reIndent(content, ismlOffset);
    }

    return node.toString();
};

const unindent = (content, indentSize) => {
    const lineArray = content.split(Constants.EOL);
    const result    = [];

    for (let i = 0; i < lineArray.length; i++) {
        const line = lineArray[i];

        result.push(line.substring(indentSize));
    }

    return result.join(Constants.EOL);
};

const reIndent = (content, ismlIndentation) => {
    const lineArray = content.split(Constants.EOL);
    const result    = [];

    for (let i = 0; i < lineArray.length; i++) {
        const line = lineArray[i];

        result.push(line.trim() ? ismlIndentation + line : '');
    }

    return result.join(Constants.EOL);
};

const getIsmlOffset = node => {
    const indentSize    = (node.depth - 1) * 4;
    let ismlIndentation = '';

    for (let i = 0; i < indentSize; i = i + 1) {
        ismlIndentation += ' ';
    }

    return ismlIndentation;
};

const getIndentErrorLength = (eslintError, ismlOffset) => {
    const messageWordList = eslintError.message.split(' ');

    return Number(messageWordList[7].slice(0, -1)) + ismlOffset.length;
};

const getIsmlIdentMessage = (eslintError, ismlOffset) => {
    const messageWordList = eslintError.message.split(' ');

    messageWordList[3] = Number(messageWordList[3]) + ismlOffset.length;
    messageWordList[7] = Number(messageWordList[7].slice(0, -1)) + ismlOffset.length + '.';

    return messageWordList.join(' ');
};

module.exports = Rule;
