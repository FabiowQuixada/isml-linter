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
        size                   : 4,
        attributeOffset        : 4,
        standAloneClosingChars : {
            nonSelfClosingTag : 'always',
            selfClosingTag    : 'never',
            quote             : 'never'
        }
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

Rule.isTailBroken = function(node) {

    const configIndentSize         = this.getConfigs().indent;
    const expectedIndentation      = getExpectedIndentation(node, configIndentSize);
    const actualIndentation        = getActualTailIndentation(node);
    const isInSameLineAsOpeningTag = node.endLineNumber === node.tailLineNumber;
    const isInSameLineAsLastChild  = node.hasChildren() && node.getLastChild().getLastLineNumber() === node.tailLineNumber;

    return !node.isRoot() &&
        !node.isContainer() &&
        !node.isEmpty() &&
        !node.isInSameLineAsParent() &&
        expectedIndentation !== actualIndentation &&
        !isInSameLineAsLastChild &&
        !isInSameLineAsOpeningTag;
};

Rule.isClosingCharBroken = function(node) {

    const closingCharsConfigs    = Rule.getConfigs().standAloneClosingChars;
    const isFirstChildInSameLine = node.hasChildren() && node.endLineNumber === node.children[0].lineNumber;

    if (!node.isTag()
        || !node.isMultiLineOpeningTag()
        || isFirstChildInSameLine
        || !closingCharsConfigs
        || !node.isSelfClosing() && (!closingCharsConfigs.nonSelfClosingTag || closingCharsConfigs.nonSelfClosingTag === 'any')
        || node.isSelfClosing() && (!closingCharsConfigs.selfClosingTag || closingCharsConfigs.selfClosingTag === 'any')
    ) {
        return {
            isBroken : false
        };
    }

    if (node.isSelfClosing()) {
        if (closingCharsConfigs.selfClosingTag === 'always') {
            const nodeHeadLineList           = node.head.trim().split(Constants.EOL);
            const isClosingCharStandingAlone = nodeHeadLineList[nodeHeadLineList.length - 1].trim() === '/>';

            return {
                isBroken : !isClosingCharStandingAlone,
                config   : 'always'
            };

        } else if (closingCharsConfigs.selfClosingTag === 'never') {
            const nodeHeadLineList           = node.head.trim().split(Constants.EOL);
            const isClosingCharStandingAlone = nodeHeadLineList[nodeHeadLineList.length - 1].trim() === '/>';

            return {
                isBroken : isClosingCharStandingAlone,
                config   : 'never'
            };
        }
    } else {
        if (closingCharsConfigs.nonSelfClosingTag === 'always') {
            const nodeHeadLineList           = node.head.trim().split(Constants.EOL);
            const isClosingCharStandingAlone = nodeHeadLineList[nodeHeadLineList.length - 1].trim() === '>';

            return {
                isBroken : !isClosingCharStandingAlone,
                config   : 'always'
            };

        } else if (closingCharsConfigs.nonSelfClosingTag === 'never') {
            const nodeHeadLineList           = node.head.trim().split(Constants.EOL);
            const isClosingCharStandingAlone = nodeHeadLineList[nodeHeadLineList.length - 1].trim() === '>';

            return {
                isBroken : isClosingCharStandingAlone,
                config   : 'never'
            };
        }
    }
};

Rule.isQuoteClosingCharBroken = function(node) {

    const quoteConfig   = Rule.getConfigs().standAloneClosingChars.quote;
    const attributeList = node.getAttributeList();
    const result        = [];

    for (let i = 0; i < attributeList.length; i++) {
        const attribute = attributeList[i];

        if (attribute.value) {
            const attributeValueLineList     = attribute.fullContent.trim().split(Constants.EOL);
            const isClosingCharStandingAlone = attributeValueLineList[attributeValueLineList.length - 1].trim() === attribute.quoteChar;
            const lineNumber                 = attribute.lineNumber + ParseUtils.getLineBreakQty(attribute.fullContent);
            const lineList                   = attribute.value.split(Constants.EOL);
            const columnNumber               = lineList[lineList.length - 1].length + 1;
            const globalPos                  = attribute.globalPos
                + attribute.fullContent.lastIndexOf(attribute.quoteChar)
                + lineNumber - 2;
            const formattedLineList          = lineList
                .map( line => line.trim())
                .filter( line => line );
            const lastLine                   = formattedLineList[formattedLineList.length - 1];

            const message = quoteConfig === 'always' && !isClosingCharStandingAlone ? getStandAloneQuoteDescription(lastLine) :
                quoteConfig === 'never' && isClosingCharStandingAlone ? getNonStandAloneQuoteDescription(lastLine) :
                    '';

            if (message) {
                const lineBreak = node.getRoot().tree.originalLineBreak;
                const line      = node
                    .getRoot()
                    .toString()
                    .split(lineBreak)[lineNumber - 1];

                result.push({
                    quoteChar    : attribute.quoteChar,
                    line         : line,
                    lineNumber   : lineNumber,
                    columnNumber : columnNumber,
                    globalPos    : globalPos,
                    length       : attribute.quoteChar.length,
                    message      : message
                });
            }
        }
    }

    return result;
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
            const nodeHead            = node.head.trim();
            const occurrenceLength    = actualIndentation === 0 ?
                nodeHead.length + ParseUtils.getLineBreakQty(nodeHead) :
                getActualIndentation(node);

            const error = this.getError(
                node.head.trim(),
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

        // Checks node tail value;
        if (node.tail && this.isTailBroken(node)) {
            const configIndentSize    = ruleConfig.indent;
            const expectedIndentation = getExpectedIndentation(node, configIndentSize);
            const actualIndentation   = getActualTailIndentation(node);
            const nodeTail            = node.tail.trim();
            const occurrenceLength    = actualIndentation === 0 ?
                nodeTail.length +  ParseUtils.getLineBreakQty(nodeTail) :
                getActualTailIndentation(node);
            const tailGlobalPos       = node.tailGlobalPos - getActualTailIndentation(node);

            const error = this.getError(
                node.tail.trim(),
                node.tailLineNumber,
                node.tailColumnNumber,
                tailGlobalPos,
                occurrenceLength,
                getOccurrenceDescription(expectedIndentation, actualIndentation)
            );

            occurrenceList.push(error);
        }

        const quoteOccurrenceList = this.isQuoteClosingCharBroken(node);
        occurrenceList.push(...quoteOccurrenceList);

        const checkResult = this.isClosingCharBroken(node);
        if (checkResult.isBroken) {
            if (node.isSelfClosing()) {
                const closingChar  = '/>';
                const globalPos    = node.globalPos
                    + node.head.trim().lastIndexOf(closingChar);
                const lineList     = node.head.split(Constants.EOL);
                const columnNumber = lineList[lineList.length - 1].lastIndexOf(closingChar) + 1;
                const message      = checkResult.config === 'always' ?
                    getStandAloneCharDescription(node.getType(), closingChar) :
                    getNonStandAloneCharDescription(node.getType(), closingChar);

                const error = this.getError(
                    node.head.trim(),
                    node.endLineNumber,
                    columnNumber,
                    globalPos,
                    closingChar.length,
                    message
                );

                occurrenceList.push(error);

            } else {
                const closingChar  = '>';
                const globalPos    = node.globalPos
                    + node.head.trim().length - closingChar.length;
                const lineList     = node.head.trim().split(Constants.EOL);
                const columnNumber = lineList[lineList.length - 1].lastIndexOf(closingChar) + 1;
                const message      = checkResult.config === 'always' ?
                    getStandAloneCharDescription(node.getType(), closingChar) :
                    getNonStandAloneCharDescription(node.getType(), closingChar);

                const error = this.getError(
                    node.head.trim(),
                    node.endLineNumber,
                    columnNumber,
                    globalPos,
                    closingChar.length,
                    message
                );

                occurrenceList.push(error);
            }
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

            if (i > 0) {
                const partialResult = getAttributeNestedValueError(attribute, attributeValueList, i, expectedIndentation, configAttributeOffsetSize);

                if (partialResult.error) {
                    result.push(partialResult.error);
                }

                if (partialResult.shouldContinueLoop) {
                    continue;
                }
            }

            const error = getAttributeValueError(attribute, attributeValueList, i, expectedIndentation);

            if (error) {
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
                    attribute.fullContent,
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
    const content   = node.head;
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
    const attributeRootNode = TreeBuilder.parse(attribute.fullContent, null, null, true);
    const fixedContent      = Rule.getFixedContent(attributeRootNode);

    return fixedContent
        .split(Constants.EOL)
        .map( (line, i) => {
            const shouldAddLineBreak = i === 0 && attribute.isFirstInLine && !attribute.isInSameLineAsTagName && attribute.index !== 0;

            if (attribute.isInSameLineAsPreviousAttribute) {
                return ' ' + line;
            }

            return (shouldAddLineBreak ? Constants.EOL : '')
                + nodeIndentation
                + attributeOffset
                + line;
        })
        .join(Constants.EOL);
};

const getTreeBuiltAttributeIndentedValue = (attribute, nodeIndentation, attributeOffset) => {
    const attributeRootNode = TreeBuilder.parse(attribute.value, null, null, true);
    const fixedContent      = Rule.getFixedContent(attributeRootNode);

    return fixedContent
        .split(Constants.EOL)
        .map( (line, i) => {

            // If line contains only blank spaces;
            if (!line.trim()) {
                return '';
            }

            if (i === 0 && attribute.isFirstInLine && !attribute.isInSameLineAsTagName && attribute.index !== 0) {
                return Constants.EOL + nodeIndentation + attributeOffset + line;
            }

            if (i === 0 && attribute.isFirstValueInSameLineAsAttributeName) {
                return line;
            }

            return nodeIndentation + attributeOffset + line;
        })
        .filter( (line, i, list) => {
            if (i === 0 && attribute.isFirstValueInSameLineAsAttributeName && line === '') {
                return false;
            }

            if (i === list.length - 1 && line === '') {
                return false;
            }

            return i === 0 || line;
        })
        .join(Constants.EOL);
};

const getAttributeIndentedValues = (attribute, nodeIndentation, attributeOffset) => {
    let result = '';

    if (attribute.value) {
        if (attribute.value.indexOf('<is') >= 0) {
            result = '=' + attribute.quoteChar + getTreeBuiltAttributeIndentedValue(attribute, nodeIndentation, attributeOffset + attributeOffset);

        } else {
            result = '=' + attribute.quoteChar + attribute.value
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
                .join(Constants.EOL);
        }
    }

    return result;
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

            const formattedAttributeName = attribute.isExpressionAttribute ?
                getExpressionAttributeIndentation(attribute.name, nodeIndentation, attributeOffset) :
                attribute.name;

            const formattedAttributeValue = getAttributeIndentedValues(attribute, nodeIndentation, attributeOffset);

            const closingQuote = shouldAddIndentationToClosingQuote(attribute) ?
                Constants.EOL + nodeIndentation + attributeOffset + attribute.quoteChar :
                attribute.quoteChar;

            const valueList = attributePrefix
                + (index > 0 && attribute.isInSameLineAsTagName ? ' ' : '')
                + formattedAttributeName
                + formattedAttributeValue
                + (attribute.isExpressionAttribute ? '' : closingQuote);

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

        result += attribute.fullContent;
    }

    return result;
};

const getExpressionAttributeIndentation = (attributeValue, nodeIndentation, attributeOffset) => {
    return attributeValue
        .split(Constants.EOL)
        .map( (line, i) => {
            return nodeIndentation + attributeOffset + (i > 0 ? attributeOffset : '') + line;
        })
        .join(Constants.EOL)
        .trimStart();
};

const getClosingChars = node => {
    const nodeHead = node.head.trim();

    if (nodeHead.endsWith(' />')) {
        return ' />';
    } else if (nodeHead.endsWith('/>')) {
        return ' />';
    } else if (nodeHead.endsWith(' >')) {
        return ' >';
    } else if (nodeHead.endsWith('>')) {
        return '>';
    }

    return '';
};

const addIndentation = (node, isOpeningTag) => {
    const content             = isOpeningTag ? node.head : node.tail;
    const startingPos         = ParseUtils.getNextNonEmptyCharPos(content);
    const endingPos           = content.length - ParseUtils.getNextNonEmptyCharPos(content.split('').reverse().join(''));
    const fullLeadingContent  = content.substring(0, startingPos);
    const preLineBreakContent = fullLeadingContent.substring(0, fullLeadingContent.lastIndexOf(Constants.EOL) + 1);
    const fullTrailingContent = content.substring(endingPos);
    const nodeIndentation     = node.isInSameLineAsParent() && isOpeningTag ? '' : Rule.getIndentation(node.depth - 1);
    const attributeOffset     = Rule.getAttributeIndentationOffset();
    const attributeList       = node.getAttributeList();
    const leadingLineBreakQty = ParseUtils.getLeadingLineBreakQty(node.head);
    let contentResult         = '';

    if (isOpeningTag) {
        const shouldAddIndentationToClosingChar = shouldAddIndentationToClosingChars(node);
        const closingChars                      = getClosingChars(node);
        const tagNameEndPos                     = leadingLineBreakQty
            + ParseUtils.getFirstEmptyCharPos(node.head.trim()) + 1;

        if (ParseUtils.getLineBreakQty(node.head.trim()) > 0 || shouldAddIndentationToClosingChar && node.isSelfClosing()) {
            contentResult = attributeList.length > 0 ?
                node.head.trimStart().substring(0, tagNameEndPos - leadingLineBreakQty).trimStart() :
                node.head.trimStart();

            for (let i = 0; i < attributeList.length; i++) {
                contentResult += indentAttribute(attributeList, i, nodeIndentation, attributeOffset);
            }

            if (attributeList.length > 0) {
                contentResult += shouldAddIndentationToClosingChar ?
                    Constants.EOL + nodeIndentation + closingChars.trimStart() :
                    closingChars;
            }
        } else {
            contentResult = node.head.trim();
        }

        if (node.isOfType('html_conditional_comment')) {
            contentResult = contentResult
                .split(Constants.EOL)
                .map((line, i) => i > 0 ? nodeIndentation + line : line)
                .join(Constants.EOL);
        }
    } else {
        contentResult = node.tail.trim();
    }

    return preLineBreakContent + nodeIndentation + contentResult + fullTrailingContent;
};

const removeAllIndentation = node => {
    if (!node.isRoot() && !node.isContainer() && !node.parent.isOneOfTypes(['isscript', 'script'])) {

        const shouldRemoveHeadIndentation = node.head && !node.isInSameLineAsPreviousSibling() && !node.isInSameLineAsParent() && !(node.lineNumber === node.parent.endLineNumber);
        const shouldRemoveTailIndentation = !!(node.tail && !(node.hasChildren() && node.getLastChild().lineNumber === node.tailLineNumber));

        if (shouldRemoveHeadIndentation) {
            node.head = removeIndentation(node.head);
        }

        if (shouldRemoveTailIndentation) {
            node.tail = removeIndentation(node.tail);
        }
    }

    for (let i = 0; i < node.children.length; i++) {
        removeAllIndentation(node.children[i]);
    }
};

const addCorrectIndentation = node => {

    if (!node.isRoot() && !node.isContainer() && !node.parent.isOneOfTypes(['isscript', 'script'])) {
        if (node.parent.isOfType('iscomment')) {
            const shouldAddIndentationToText = checkIfShouldAddIndentationToHead(node);

            if (shouldAddIndentationToText) {
                node.head = addIndentationToText(node);
            }
        } else {
            const shouldAddIndentationToHead = checkIfShouldAddIndentationToHead(node);
            const shouldAddIndentationToTail = checkIfShouldAddIndentationToTail(node);

            if (shouldAddIndentationToHead) {
                node.head = addIndentation(node, true);
            }

            if (shouldAddIndentationToTail) {
                node.tail = addIndentation(node, false);
            }
        }
    }

    for (let i = 0; i < node.children.length; i++) {
        addCorrectIndentation(node.children[i]);
    }
};

const shouldAddIndentationToClosingChars = node => {
    const closingCharsConfigs = Rule.getConfigs().standAloneClosingChars;

    if (node.isSelfClosing()) {
        if (closingCharsConfigs.selfClosingTag === 'always') {
            return true;
        } else if (closingCharsConfigs.selfClosingTag === 'never') {
            return false;
        }
    } else {
        if (closingCharsConfigs.nonSelfClosingTag === 'always') {
            return true;
        } else if (closingCharsConfigs.nonSelfClosingTag === 'never') {
            return false;
        }
    }

    const lineList = node.head.split(Constants.EOL);
    const lastLine = lineList[lineList.length - 1];

    return ['/>', '>'].indexOf(lastLine) >= 0;
};

const shouldAddIndentationToClosingQuote = attribute => {
    const closingCharsConfigs = Rule.getConfigs().standAloneClosingChars;

    if (!attribute.value || !closingCharsConfigs.quote || closingCharsConfigs.quote === 'always') {
        return true;
    } else if (closingCharsConfigs.quote === 'never') {
        return false;
    }

    const lineList = attribute.value.split(Constants.EOL);
    const lastLine = lineList[lineList.length - 1];

    return lastLine.trim().length === 0;
};

const checkIfShouldAddIndentationToHead = node => {
    const previousSibling                   = node.getPreviousSibling();
    const isInSameLineAsPrevSiblingLastLine = !node.isRoot() &&
        previousSibling &&
        node.lineNumber === previousSibling.getLastLineNumber();
    const isInSameLineAsParentHeadEnd       = node.parent.endLineNumber === node.lineNumber && !node.parent.isContainer();

    const shouldAdd = !node.isRoot() &&
        !isInSameLineAsPrevSiblingLastLine &&
        !isInSameLineAsParentHeadEnd &&
        (node.isFirstChild() || previousSibling && node.lineNumber !== previousSibling.lineNumber) &&
        node.head && node.lineNumber !== node.parent.endLineNumber;

    return shouldAdd;
};

const checkIfShouldAddIndentationToTail = node => {
    const hasTail                   = !!node.tail;
    const isLastClause              = !!node.parent && node.parent.isContainer() && !node.isLastChild();
    const isInSameLineAsChild       = !node.hasChildren() || node.getLastChild().isInSameLineAsParent();
    const isTailInSameLineAsChild   = !node.hasChildren() || node.tailLineNumber === node.getLastChild().getLastLineNumber();
    const isBrokenIntoMultipleLines = !node.hasChildren() && node.tailLineNumber && node.lineNumber !== node.tailLineNumber;
    const isInSameLineAsOpeningTag  = !node.hasChildren() && node.tailLineNumber && node.endLineNumber === node.tailLineNumber;

    const shouldAdd = hasTail &&
        !isTailInSameLineAsChild &&
        !isInSameLineAsChild &&
        !isLastClause
    // TODO Works for a specific case only. Might have side effects;
    ||
        node.isOfType('iscomment') && !isTailInSameLineAsChild
    ||
        isBrokenIntoMultipleLines;

    // TODO Merge this condition into the above ones;
    if (isInSameLineAsOpeningTag) {
        return false;
    }

    return shouldAdd;
};

// TODO This a workaround, it should be handled directly in ParseUtils.getElementList();
const getEslintChildTrailingSpaces = node => {
    if (node.isOfType('isscript')) {
        const child = node.getLastChild();

        const trailingSpacesQty = child.head
            .replace(/\r\n/g, '_')
            .split('')
            .reverse()
            .join('')
            .search(/\S/);

        return trailingSpacesQty - 1;
    }

    return 0;
};

const getAttributeNestedValueError = (attribute, attributeValueList, i, expectedIndentation, configAttributeOffsetSize) => {
    const tagList          = ['isif', 'iselse', 'iselseif'];
    let shouldContinueLoop = false;

    for (let j = 0; j < tagList.length; j++) {
        const element           = tagList[j];
        const previousAttribute = attributeValueList[i - 1];

        if (previousAttribute.indexOf(element) >= 0 && previousAttribute.indexOf('</isif>') === -1) {
            const error = getAttributeValueError(attribute, attributeValueList, i, expectedIndentation + configAttributeOffsetSize);

            shouldContinueLoop = true;

            if (error) {
                return {
                    error,
                    shouldContinueLoop
                };
            }
        }
    }

    return {
        shouldContinueLoop
    };
};

const getAttributeValueError = (attribute, attributeValueList, i, expectedIndentation) => {
    const attributeValue                   = attributeValueList[i];
    const valueColumnNumber                = ParseUtils.getLeadingEmptyChars(attributeValue).length;
    const attributeValueStartPos           = attribute.value.indexOf(attributeValue);
    const attributeValuePrefix             = attribute.value.substring(0, attributeValueStartPos);
    const isValueInSameLineAsAttributeName = ParseUtils.getLineBreakQty(attributeValuePrefix) === 0;

    if (!isValueInSameLineAsAttributeName && valueColumnNumber !== expectedIndentation) {
        const attributeValueFullPrefix = attribute.fullContent.substring(0, attribute.fullContent.indexOf(attributeValue.trim()));
        const lineBreakQty             = ParseUtils.getLineBreakQty(attributeValueFullPrefix);
        const occurrenceGlobalPos      = attribute.globalPos + attribute.fullContent.indexOf(attributeValueList[i]) + attribute.lineNumber - 1;
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

        return error;
    }

    return null;
};

const getStandAloneQuoteDescription    = lastValue => `Closing quote should not be in the same line as "${lastValue}"`;
const getNonStandAloneQuoteDescription = lastValue => `Closing quote should be in the same line as "${lastValue}"`;
const getStandAloneCharDescription     = (tagName, closingChars) => `"${closingChars}" should not be in the same line as <${tagName}> tag last attribute`;
const getNonStandAloneCharDescription  = (tagName, closingChars) => `"${closingChars}" should be in the same line as <${tagName}> tag last attribute`;
const getOccurrenceDescription         = (expected, actual) => `Expected indentation of ${expected} spaces but found ${actual}`;
const getExpectedIndentation           = (node, configIndentSize) => (node.depth - 1) * configIndentSize;
const getActualIndentation             = node => node.getIndentationSize();
const getActualTailIndentation         = node => node.getTailIndentationSize() + getEslintChildTrailingSpaces(node);

module.exports = Rule;
