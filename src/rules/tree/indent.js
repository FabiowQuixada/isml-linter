const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ParseUtils        = require('../../isml_tree/components/ParseUtils');
const Constants         = require('../../Constants');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Line incorrectly indented';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.getDefaultAttrs = () => {
    return {
        size : 4
    };
};

Rule.getIndentation = function(depth = 1) {
    const indentationSize = this.getConfigs().size * depth;
    let indentation       = '';

    for (let i = 0; i < indentationSize; ++i) {
        indentation += ' ';
    }

    return indentation;
};

Rule.isBroken = function(node) {

    const configIndentSize    = this.getConfigs().size;
    const expectedIndentation = (node.depth - 1) * configIndentSize;
    const actualIndentation   = node.getIndentationSize();

    return !node.isRoot() &&
        !node.isEmpty() &&
        !node.isInSameLineAsParent() &&
        expectedIndentation !== actualIndentation;
};

Rule.check = function(node, result) {

    this.result = result || {
        occurrences : []
    };

    for (let i = 0; i < node.children.length; i++) {
        this.check(node.children[i], this.result);
    }

    const config    = this.getConfigs();
    const globalPos = node.globalPos - node.getIndentationSize();

    if (this.isBroken(node)) {
        this.add(
            node.value.trim(),
            node.lineNumber - 1,
            globalPos,
            node.getIndentationSize(),
            description
        );
    }

    if (this.result.occurrences.length &&
        config.autoFix &&
        this.getFixedContent &&
        node.isRoot()) {
        this.result.fixedContent = this.getFixedContent(node);
    }

    return this.result;
};

const removeIndentation = content => {
    const startingPos            = ParseUtils.getNextNonEmptyCharPos(content);
    const endingPos              = content.length - ParseUtils.getNextNonEmptyCharPos(content.split('').reverse().join(''));
    const fullLeadingContent     = content.substring(0, startingPos);
    const actualContent          = content.substring(startingPos, endingPos);
    const preLineBreakContent    = fullLeadingContent.substring(0, fullLeadingContent.lastIndexOf(Constants.EOL) + 1);
    const fullTrailingContent    = content.substring(endingPos);
    const lastLineBreakPos       = fullTrailingContent.lastIndexOf(Constants.EOL);
    const trimmedTrailingContent = lastLineBreakPos === -1 ?
        fullTrailingContent :
        fullTrailingContent.substring(0, lastLineBreakPos + 1);

    return preLineBreakContent + actualContent + trimmedTrailingContent;
};

const addIndentation = (content, node) => {
    const startingPos         = ParseUtils.getNextNonEmptyCharPos(content);
    const endingPos           = content.length - ParseUtils.getNextNonEmptyCharPos(content.split('').reverse().join(''));
    const fullLeadingContent  = content.substring(0, startingPos);
    const actualContent       = content.substring(startingPos, endingPos);
    const preLineBreakContent = fullLeadingContent.substring(0, fullLeadingContent.lastIndexOf(Constants.EOL) + 1);
    const fullTrailingContent = content.substring(endingPos);
    const correctIndentation  = node.isInSameLineAsParent() ? '' : Rule.getIndentation(node.depth - 1);

    return preLineBreakContent + correctIndentation + actualContent + fullTrailingContent;
};

const removeAllIndentation = node => {
    if (node.value) {
        node.value = removeIndentation(node.value);
    }

    if (node.suffixValue) {
        node.suffixValue = removeIndentation(node.suffixValue);
    }

    for (let i = 0; i < node.children.length; i++) {
        removeAllIndentation(node.children[i]);
    }
};

const addCorrectIndentation = node => {
    const shouldAddIndentationToSuffix = node.suffixValue &&
        (!node.hasChildren() && node.lineNumber !== node.suffixLineNumber) ||
        node.getLastChild() && node.suffixLineNumber !== node.getLastChild().getLastLineNumber() &&
        node.getLastChild() && !node.getLastChild().isInSameLineAsParent() &&
        !(node.parent && node.parent.isMulticlause() && !node.isLastChild());

    const shouldAddIndentationToValue = !node.isRoot() &&
        (node.isFirstChild() || node.getPreviousSibling() && node.lineNumber !== node.getPreviousSibling().lineNumber) &&
        node.value && node.lineNumber !== node.parent.endLineNumber;

    if (shouldAddIndentationToValue) {
        node.value = addIndentation(node.value, node);
    }

    if (shouldAddIndentationToSuffix) {
        node.suffixValue = addIndentation(node.suffixValue, node);
    }

    for (let i = 0; i < node.children.length; i++) {
        addCorrectIndentation(node.children[i]);
    }
};

Rule.getFixedContent = rootNode => {
    removeAllIndentation(rootNode);
    addCorrectIndentation(rootNode);

    return rootNode.toString();
};

module.exports = Rule;
