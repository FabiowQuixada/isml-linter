const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ParseUtils        = require('../../isml_tree/ParseUtils');
const TreeBuilder       = require('../../isml_tree/TreeBuilder');
const Constants         = require('../../Constants');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Line incorrectly indented';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.getDefaultAttrs = () => {
    return {
        size            : 4,
        attributeOffset : 4
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

Rule.getAttributeIndentationOffset = function() {
    const offsetSize = this.getConfigs().attributeOffset;
    let indentation  = '';

    for (let i = 0; i < offsetSize; ++i) {
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
        !node.isInSameLineAsParentEnd() &&
        expectedIndentation !== actualIndentation &&
        !node.isInSameLineAsPreviousSibling();
};

Rule.isBrokenForSuffix = function(node) {

    const configIndentSize         = this.getConfigs().indent;
    const expectedIndentation      = getExpectedIndentation(node, configIndentSize);
    const actualIndentation        = getActualIndentationForSuffix(node);
    const isInSameLineAsOpeningTag = node.lineNumber === node.suffixLineNumber;
    const isInSameLineAsLastChild  = node.hasChildren() && node.getLastChild().getLastLineNumber() === node.suffixLineNumber;

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

        const errorGlobalPos     = node.globalPos - getActualIndentation(node);
        const attributeErrorList = getAttributeErrorList(node);

        // Checks node value;
        if (this.isBroken(node)) {
            const configIndentSize    = ruleConfig.indent;
            const expectedIndentation = getExpectedIndentation(node, configIndentSize);
            const actualIndentation   = getActualIndentation(node);
            const nodeValue           = node.value.trim();
            const occurrenceLength    = actualIndentation === 0 ?
                nodeValue.length + ParseUtils.getLineBreakQty(nodeValue) :
                getActualIndentation(node);

            const error = this.getError(
                node.value.trim(),
                node.lineNumber,
                node.columnNumber,
                errorGlobalPos,
                occurrenceLength,
                getOccurrenceDescription(expectedIndentation, actualIndentation)
            );

            occurrenceList.push(error);
        }

        if (attributeErrorList.length > 0) {
            for (let i = 0; i < attributeErrorList.length; i++) {
                const attributeError = attributeErrorList[i];
                occurrenceList.push(attributeError);
            }
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

/**
 * PRIVATE FUNCTIONS
*/

const getAttributeValueErrorList = function(node, attribute) {

    if (!attribute.value) {
        return [];
    }

    const configIndentSize          = Rule.getConfigs().indent;
    const configAttributeOffsetSize = Rule.getConfigs().attributeOffset;
    const result                    = [];

    if (attribute.hasMultilineValue) {
        const expectedIndentation = node.depth * configIndentSize + configAttributeOffsetSize;
        const attributeValueList  = attribute.value
            .split(Constants.EOL)
            .filter( attr => attr.trim() && ['{', '}'].indexOf(attr.trim()) === -1);

        for (let i = 0; i < attributeValueList.length; i++) {
            const attributeValue                   = attributeValueList[i];
            const valueColumnNumber                = ParseUtils.getLeadingEmptyChars(attributeValue).length;
            const attributeValueStartPos           = attribute.value.indexOf(attributeValue);
            const attributeValuePrefix             = attribute.value.substring(0, attributeValueStartPos);
            const isValueInSameLineAsAttributeName = ParseUtils.getLineBreakQty(attributeValuePrefix) === 0;

            if (!isValueInSameLineAsAttributeName && valueColumnNumber !== expectedIndentation) {
                const attributeValueFullPrefix = attribute.fullValue.substring(0, attribute.fullValue.indexOf(attributeValue.trim()));
                const lineBreakQty             = ParseUtils.getLineBreakQty(attributeValueFullPrefix);
                const occurrenceGlobalPos      = attribute.globalPos + attribute.fullValue.indexOf(attributeValueList[i]) + attribute.lineNumber - 1;
                const lineNumber               = attribute.lineNumber + lineBreakQty;

                const occurrenceColumnNumber = valueColumnNumber === 0 ?
                    valueColumnNumber :
                    0;

                const occurrenceLength = valueColumnNumber === 0 ?
                    attributeValue.length :
                    valueColumnNumber;

                const error = Rule.getError(
                    attributeValue.trim(),
                    lineNumber,
                    occurrenceColumnNumber,
                    occurrenceGlobalPos,
                    occurrenceLength,
                    getOccurrenceDescription(expectedIndentation, valueColumnNumber)
                );

                result.push(error);
            }
        }
    }

    return result;
};

const getAttributeErrorList = function(node) {
    const configIndentSize = Rule.getConfigs().indent;
    const attributeList    = node.getAttributeList();
    const result           = [];

    for (let i = 0; i < attributeList.length; i++) {
        const attribute = attributeList[i];

        if (!attribute.isInSameLineAsTagName && attribute.isFirstInLine) {
            const expectedIndentation = node.depth * configIndentSize;

            if (attribute.columnNumber - 1 !== expectedIndentation) {
                const occurrenceGlobalPos = attribute.globalPos + node.lineNumber - attribute.columnNumber;
                const occurrenceLength    = attribute.columnNumber === 1 ?
                    attribute.length + ParseUtils.getLineBreakQty(attribute.value) :
                    attribute.columnNumber - 1;

                const error = Rule.getError(
                    attribute.fullValue,
                    attribute.lineNumber,
                    attribute.columnNumber,
                    occurrenceGlobalPos,
                    occurrenceLength,
                    getOccurrenceDescription(expectedIndentation, attribute.columnNumber - 1)
                );

                result.push(error);
            }
        }

        const attributeErrorList = getAttributeValueErrorList(node, attribute);
        result.push(...attributeErrorList);
    }

    return result;
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

    // Removes indentation from node attributes;
    const indentlessContent = actualContent
        .split(Constants.EOL)
        .map(line => line.trimStart())
        .join(Constants.EOL);

    return preLineBreakContent + indentlessContent + trimmedTrailingContent;
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

        if (!(i === 0 && formattedLine.length === 0)) {
            formattedLineArray.push(formattedLine);
        }
    }

    return preLineBreakContent + formattedLineArray.join(Constants.EOL);
};

const getIndentedNestedIsmlContent = (attribute, nodeIndentation, attributeOffset) => {
    if (attribute.fullValue.startsWith('<isif')) {
        const attributeRootNode = TreeBuilder.parse(attribute.fullValue, null, null, true);
        const fixedContent      = Rule.getFixedContent(attributeRootNode);

        return fixedContent
            .split(Constants.EOL)
            .map( (line, i) => {
                if (i === 0 && attribute.isFirstInLine && !attribute.isInSameLineAsTagName && attribute.index !== 0) {
                    return Constants.EOL + nodeIndentation + attributeOffset + line;
                }

                return nodeIndentation + attributeOffset + line;
            })
            .join(Constants.EOL);
    }
};

const indentAttribute = (attributeList, index, nodeIndentation, attributeOffset) => {
    const attribute = attributeList[index];
    let result      = '';

    const isInSameLineAsPreviousAttribute = index > 0 && attributeList[index - 1].lineNumber === attribute.lineNumber;

    if (attribute.hasMultilineValue) {
        if (attribute.isNestedIsmlTag) {
            result += getIndentedNestedIsmlContent(attribute, nodeIndentation, attributeOffset);

        } else {
            let attributePrefix = '';

            if (attribute.isFirstInLine) {
                if (index > 0) {
                    attributePrefix += Constants.EOL;
                }

                attributePrefix += nodeIndentation + attributeOffset;
            }

            const valueList = attributePrefix + attribute.name + '=' + attribute.quoteChar + attribute.value
                .split(Constants.EOL)
                .filter( value => value )
                .map( (value, i) => {
                    if (i === 0) {
                        return attribute.isFirstValueInSameLineAsAttributeName ?
                            value :
                            Constants.EOL + nodeIndentation + attributeOffset + attributeOffset + value;
                    }

                    return nodeIndentation + attributeOffset + attributeOffset + value;
                })
                .join(Constants.EOL)
                + Constants.EOL + nodeIndentation + attributeOffset + attribute.quoteChar;

            result += valueList;
        }
    } else {
        if (isInSameLineAsPreviousAttribute) {
            result += ' ';

        } else if (!attribute.isInSameLineAsTagName) {
            if (index !== 0) {
                result += Constants.EOL;
            }

            result += nodeIndentation + attributeOffset;
        }

        result += attribute.fullValue;
    }

    return result;
};

const getClosingChars = node => {
    const nodeValue = node.value.trim();

    if (nodeValue.endsWith(' />')) {
        return ' />';
    } else if (nodeValue.endsWith('/>')) {
        return '/>';
    } else if (nodeValue.endsWith(' >')) {
        return ' >';
    } else if (nodeValue.endsWith('>')) {
        return '>';
    }

    return '';
};

const addIndentation = (node, isOpeningTag) => {
    const content             = isOpeningTag ? node.value : node.suffixValue;
    const startingPos         = ParseUtils.getNextNonEmptyCharPos(content);
    const endingPos           = content.length - ParseUtils.getNextNonEmptyCharPos(content.split('').reverse().join(''));
    const fullLeadingContent  = content.substring(0, startingPos);
    const preLineBreakContent = fullLeadingContent.substring(0, fullLeadingContent.lastIndexOf(Constants.EOL) + 1);
    const fullTrailingContent = content.substring(endingPos);
    const nodeIndentation     = node.isInSameLineAsParent() && isOpeningTag ? '' : Rule.getIndentation(node.depth - 1);
    const attributeOffset     = Rule.getAttributeIndentationOffset();
    const attributeList       = node.getAttributeList();
    let contentResult         = '';

    if (isOpeningTag) {
        const tagNameEndPos = ParseUtils.getLeadingLineBreakQty(node.value)
            + ParseUtils.getFirstEmptyCharPos(node.value.trim()) + 1;

        if (ParseUtils.getLineBreakQty(node.value.trim()) === 0) {
            contentResult = node.value.trimStart();
        } else {
            contentResult = attributeList.length > 0 ?
                node.value.substring(0, tagNameEndPos).trimStart() :
                node.value.trimStart();

            for (let i = 0; i < attributeList.length; i++) {
                contentResult += indentAttribute(attributeList, i, nodeIndentation, attributeOffset);
            }

            if (attributeList.length > 0) {
                const lastAttributeFullValue            = attributeList[attributeList.length - 1].fullValue;
                const lastAttributeLocalPos             = node.value.indexOf(lastAttributeFullValue);
                const nodeValueRemainingContent         = node.value.substring(lastAttributeLocalPos);
                const nodeValueLastChars                = nodeValueRemainingContent.substring(lastAttributeFullValue.length);
                const shouldAddIndentationToClosingChar = ParseUtils.getLineBreakQty(nodeValueLastChars.trimEnd()) > 0;
                const closingChars                      = getClosingChars(node);

                contentResult += shouldAddIndentationToClosingChar ?
                    Constants.EOL + nodeIndentation + closingChars.trimStart() :
                    closingChars;
            }
        }

    } else {
        contentResult = node.suffixValue.trim();
    }

    return preLineBreakContent + nodeIndentation + contentResult + fullTrailingContent;
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
    const isInSameLineAsPrevSiblingLastLine = !node.isRoot() &&
        previousSibling &&
        node.lineNumber === previousSibling.getLastLineNumber();
    const isInSameLineAsParentValueEnd      = node.parent.endLineNumber === node.lineNumber && !node.parent.isContainer();

    const shouldAdd = !node.isRoot() &&
        !isInSameLineAsPrevSiblingLastLine &&
        !isInSameLineAsParentValueEnd &&
        (node.isFirstChild() || previousSibling && node.lineNumber !== previousSibling.lineNumber) &&
        node.value && node.lineNumber !== node.parent.endLineNumber;

    return shouldAdd;
};

const checkIfShouldAddIndentationToSuffix = node => {
    const hasSuffix                 = !!node.suffixValue;
    const isLastClause              = !!node.parent && node.parent.isContainer() && !node.isLastChild();
    const isInSameLineAsChild       = !node.hasChildren() || node.getLastChild().isInSameLineAsParent();
    const isSuffixInSameLineAsChild = !node.hasChildren() || node.suffixLineNumber === node.getLastChild().getLastLineNumber();
    const isBrokenIntoMultipleLines = !node.hasChildren() && node.suffixLineNumber && node.lineNumber !== node.suffixLineNumber;

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
