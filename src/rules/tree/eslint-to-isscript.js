const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ParseUtils        = require('../../isml_tree/ParseUtils');
const Constants         = require('../../Constants');
const ConfigUtils       = require('../../util/ConfigUtils');
const GeneralUtils      = require('../../util/GeneralUtils');

const ruleId          = require('path').basename(__filename).slice(0, -3);
const description     = 'Not eslint-valid';
const notFoundMessage = 'No eslint configuration file found: ' + ConfigUtils.getEslintConfigFilePath();

const Rule = Object.create(TreeRulePrototype);

let isscriptContentArray = [];

Rule.init(ruleId, description);

Rule.addError = function(node, eslintError, ismlOffset, linter, data) {
    const errorLine = linter.getSourceCode() ?
        linter.getSourceCode().lines[eslintError.line - 1] :
        node.value.split('\n')[eslintError.line - 1];

    const duplicatedOffset = ParseUtils.getNextNonEmptyCharPos(node.value);
    const errorLocalPos    = node.value.indexOf(errorLine.trimStart()) - duplicatedOffset;
    let errorGlobalPos     = node.globalPos;
    let length             = errorLine.trimStart().length;
    let message;

    errorGlobalPos += data.isCrlfLineBreak ?
        errorLocalPos + eslintError.line - 2 :
        node.value.trimStart().indexOf(errorLine.trimStart());

    if (eslintError.ruleId === 'indent') {
        length         = getIndentErrorLength(eslintError, ismlOffset);
        message        = getIsmlIdentMessage(eslintError, ismlOffset);
        errorGlobalPos -= length;

    } else {
        message = eslintError.message;
    }

    this.add(
        ismlOffset + errorLine,
        node.lineNumber + eslintError.line - 3,
        errorGlobalPos,
        length,
        message
    );
};

Rule.check = function(node, result, data) {
    let eslintConfig = null;

    try {
        eslintConfig = ConfigUtils.loadEslintConfig();
    } catch (err) {
        this.add(null, 0, 0, 1, notFoundMessage);
        return this.result;
    }

    for (let i = 0; i < node.children.length; i++) {
        this.check(node.children[i], result, data);
    }

    if (node.isIsscriptContent()) {
        isscriptContentArray.push(node);
    }

    if (node.isRoot()) {
        const Linter = require('eslint').Linter;
        const linter = new Linter();
        this.result  = {
            occurrences : []
        };

        for (let index = 0; index < isscriptContentArray.length; index++) {
            const jsContentNode = isscriptContentArray[index];
            let content         = jsContentNode.value;

            const ismlOffset = getIsmlOffset(jsContentNode);

            content = unindent(content, ismlOffset.length);

            const errorArray = linter.verify(content, eslintConfig);

            for (let i = 0; i < errorArray.length; i++) {
                this.addError(jsContentNode, errorArray[i], ismlOffset, linter, data);
            }
        }

        isscriptContentArray = [];

        return this.result;
    }
};

Rule.getFixedContent = function(node) {
    let eslintConfig = null;

    try {
        eslintConfig = ConfigUtils.loadEslintConfig();
    } catch (err) {
        this.add(null, 0, 0, 1, notFoundMessage);
        return this.result;
    }

    for (let i = 0; i < node.children.length; i++) {
        this.getFixedContent(node.children[i]);
    }

    if (node.isIsscriptContent()) {
        const Linter     = require('eslint').Linter;
        const linter     = new Linter();
        let content      = node.value;
        const ismlOffset = getIsmlOffset(node);

        this.result.fixedContent = content = linter.verifyAndFix(content, eslintConfig).output;

        content = reindent(content, ismlOffset);

        node.value = content + ismlOffset.substring(4);
    }

    return GeneralUtils.applyActiveLinebreaks(node.toString());
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

const reindent = (content, ismlIndentation) => {
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
