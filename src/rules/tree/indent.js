const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ParseUtils        = require('../../isml_tree/ParseUtils');
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
    const indentationSize = this.getConfigs().indent * depth;
    let indentation       = '';

    for (let i = 0; i < indentationSize; ++i) {
        indentation += ' ';
    }

    return indentation;
};

Rule.isBroken = function(node) {

    const configIndentSize    = this.getConfigs().indent;
    const expectedIndentation = getExpectedIndentation(node, configIndentSize);
    const actualIndentation   = getActualIndentation(node);

    return !node.isRoot() &&
        !node.isContainer() &&
        !node.isEmpty() &&
        !node.isInSameLineAsParent() &&
        expectedIndentation !== actualIndentation &&
        !node.isInSameLineAsPreviousSibling();
};

Rule.isBrokenForSuffix = function(node) {

    const configIndentSize         = this.getConfigs().indent;
    const expectedIndentation      = getExpectedIndentation(node, configIndentSize);
    const actualIndentation        = getActualIndentationForSuffix(node);
    const isInSameLineAsOpeningTag = node.lineNumber === node.suffixLineNumber;
    const isInSameLineAsLastChild  = node.hasChildren() && node.getLastChild().lineNumber === node.suffixLineNumber;

    return !node.isRoot() &&
        !node.isContainer() &&
        !node.isEmpty() &&
        !node.isInSameLineAsParent() &&
        expectedIndentation !== actualIndentation &&
        !isInSameLineAsLastChild &&
        !isInSameLineAsOpeningTag;
};

Rule.check = function(node, data) {

    const ruleConfig   = this.getConfigs();
    const typeArray    = ['script', 'iscomment'];
    let occurrenceList = [];

    if (node.isRoot() || !node.parent.isOneOfTypes(typeArray)) {
        occurrenceList = this.checkChildren(node, data);

        const globalPos = node.globalPos - getActualIndentation(node);

        // Checks node value;
        if (this.isBroken(node)) {
            const configIndentSize    = ruleConfig.indent;
            const expectedIndentation = getExpectedIndentation(node, configIndentSize);
            const actualIndentation   = getActualIndentation(node);
            const nodeValue           = node.value.trim();
            const occurrenceLength    = actualIndentation === 0 ?
                nodeValue.length +  ParseUtils.getLineBreakQty(nodeValue) :
                getActualIndentation(node);

            const error = this.getError(
                node.value.trim(),
                node.lineNumber,
                node.columnNumber,
                globalPos,
                occurrenceLength,
                getOccurrenceDescription(expectedIndentation, actualIndentation)
            );

            occurrenceList.push(error);
        }

        // Checks node suffix value;
        if (node.suffixValue && this.isBrokenForSuffix(node)) {
            const configIndentSize    = ruleConfig.indent;
            const expectedIndentation = getExpectedIndentation(node, configIndentSize);
            const actualIndentation   = getActualIndentationForSuffix(node);
            const nodeSuffixValue     = node.suffixValue.trim();
            const occurrenceLength    = actualIndentation === 0 ?
                nodeSuffixValue.length +  ParseUtils.getLineBreakQty(nodeSuffixValue) :
                getActualIndentationForSuffix(node);
            const suffixGlobalPos     = node.suffixGlobalPos - getActualIndentationForSuffix(node);

            const error = this.getError(
                node.suffixValue.trim(),
                node.suffixLineNumber,
                node.suffixColumnNumber,
                suffixGlobalPos,
                occurrenceLength,
                getOccurrenceDescription(expectedIndentation, actualIndentation)
            );

            occurrenceList.push(error);
        }
    }

    return this.return(node, occurrenceList, ruleConfig);
};

Rule.getFixedContent = node => {
    if (node.isRoot() || !node.parent.isOfType('script')) {
        removeAllIndentation(node);
        addCorrectIndentation(node);
    }

    return node.toString();
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

const addIndentationToText = node => {
    const content   = node.value;
    const lineArray = content
        .split(Constants.EOL)
        .filter( (line, i) => !(i === 0 && line === ''))
        .map(line => line.trimStart());

    const formattedLineArray  = [];
    const startingPos         = ParseUtils.getNextNonEmptyCharPos(content);
    const fullLeadingContent  = content.substring(0, startingPos);
    const preLineBreakContent = fullLeadingContent.substring(0, fullLeadingContent.lastIndexOf(Constants.EOL) + 1);
    const correctIndentation  = node.isInSameLineAsParent() ? '' : Rule.getIndentation(node.depth - 1);

    for (let i = 0; i < lineArray.length; i++) {
        let formattedLine = lineArray[i];

        if (lineArray[i].length !== 0) {
            formattedLine = correctIndentation + lineArray[i];
        }

        formattedLineArray.push(formattedLine);
    }

    return preLineBreakContent + formattedLineArray.join(Constants.EOL);
};

const addIndentation = (node, isOpeningTag) => {
    const content             = isOpeningTag ? node.value : node.suffixValue;
    const startingPos         = ParseUtils.getNextNonEmptyCharPos(content);
    const endingPos           = content.length - ParseUtils.getNextNonEmptyCharPos(content.split('').reverse().join(''));
    const fullLeadingContent  = content.substring(0, startingPos);
    const actualContent       = content.substring(startingPos, endingPos);
    const preLineBreakContent = fullLeadingContent.substring(0, fullLeadingContent.lastIndexOf(Constants.EOL) + 1);
    const fullTrailingContent = content.substring(endingPos);
    const correctIndentation  = node.isInSameLineAsParent() && isOpeningTag ? '' : Rule.getIndentation(node.depth - 1);

    return preLineBreakContent + correctIndentation + actualContent + fullTrailingContent;
};

const removeAllIndentation = node => {
    if (!node.isRoot() && !node.isContainer() && !node.parent.isOneOfTypes(['isscript', 'script'])) {

        const shouldRemoveValueIndentation  = node.value && !node.isInSameLineAsPreviousSibling() && !node.isInSameLineAsParent() && !(node.lineNumber === node.parent.endLineNumber);
        const shouldRemoveSuffixIndentation = node.suffixValue && !(node.hasChildren() && node.getLastChild().lineNumber === node.suffixLineNumber);

        if (shouldRemoveValueIndentation) {
            node.value = removeIndentation(node.value);
        }

        if (shouldRemoveSuffixIndentation) {
            node.suffixValue = removeIndentation(node.suffixValue);
        }
    }

    for (let i = 0; i < node.children.length; i++) {
        removeAllIndentation(node.children[i]);
    }
};

const addCorrectIndentation = node => {

    if (!node.isRoot() && !node.isContainer() && !node.parent.isOneOfTypes(['isscript', 'script'])) {
        if (node.parent.isOfType('iscomment')) {
            const shouldAddIndentationToText = checkIfShouldAddIndentationToValue(node);

            if (shouldAddIndentationToText) {
                node.value = addIndentationToText(node);
            }
        } else {
            const shouldAddIndentationToValue  = checkIfShouldAddIndentationToValue(node);
            const shouldAddIndentationToSuffix = checkIfShouldAddIndentationToSuffix(node);

            if (shouldAddIndentationToValue) {
                node.value = addIndentation(node, true);
            }

            if (shouldAddIndentationToSuffix) {
                node.suffixValue = addIndentation(node, false);
            }
        }
    }

    for (let i = 0; i < node.children.length; i++) {
        addCorrectIndentation(node.children[i]);
    }
};

const checkIfShouldAddIndentationToValue = node => {
    const previousSibling                   = node.getPreviousSibling();
    const parentValueEndLineNumber          = node.parent ? node.parent.lineNumber + ParseUtils.getLineBreakQty(node.parent.value.trim()) : -1;
    const isInSameLineAsPrevSiblingLastLine = !node.isRoot() &&
        previousSibling &&
        node.lineNumber === previousSibling.getLastLineNumber();
    const isInSameLineAsParentValueEnd      = parentValueEndLineNumber === node.lineNumber && !node.parent.isContainer();

    const shouldAdd = !node.isRoot() &&
        !isInSameLineAsPrevSiblingLastLine &&
        !isInSameLineAsParentValueEnd &&
        (node.isFirstChild() || previousSibling && node.lineNumber !== previousSibling.lineNumber) &&
        node.value && node.lineNumber !== node.parent.parentValueEndLineNumber;

    return shouldAdd;
};

const checkIfShouldAddIndentationToSuffix = node => {
    const hasSuffix                 = !!node.suffixValue;
    const isLastClause              = !!node.parent && node.parent.isContainer() && !node.isLastChild();
    const isInSameLineAsChild       = !node.hasChildren() || node.getLastChild().isInSameLineAsParent();
    const isSuffixInSameLineAsChild = !node.hasChildren() || node.suffixLineNumber === node.getLastChild().getLastLineNumber();
    const isBrokenIntoMultipleLines = !node.hasChildren() && node.suffixLineNumber !== -1 && node.lineNumber !== node.suffixLineNumber;

    const shouldAdd = hasSuffix &&
        !isSuffixInSameLineAsChild &&
        !isInSameLineAsChild &&
        !isLastClause
    ||
        isBrokenIntoMultipleLines;

    return shouldAdd;
};

// TODO This a workaround, it should be handled directly in ParseUtils.getElementList();
const getEslintChildTrailingSpaces = node => {
    if (node.isOfType('isscript')) {
        const child = node.getLastChild();

        const trailingSpacesQty = child.value
            .replace(/\r\n/g, '_')
            .split('')
            .reverse()
            .join('')
            .search(/\S/);

        return trailingSpacesQty - 1;
    }

    return 0;
};

const getOccurrenceDescription      = (expected, actual) => `Expected indentation of ${expected} spaces but found ${actual}`;
const getExpectedIndentation        = (node, configIndentSize) => (node.depth - 1) * configIndentSize;
const getActualIndentation          = node => node.getIndentationSize();
const getActualIndentationForSuffix = node => node.getSuffixIndentationSize() + getEslintChildTrailingSpaces(node);

module.exports = Rule;
