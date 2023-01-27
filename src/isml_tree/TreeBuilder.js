const fs             = require('fs');
const IsmlNode       = require('./IsmlNode');
const ParseUtils     = require('./ParseUtils');
const MaskUtils      = require('./MaskUtils');
const ContainerNode  = require('./ContainerNode');
const ExceptionUtils = require('../util/ExceptionUtils');
const GeneralUtils   = require('../util/GeneralUtils');

const parse = (content, templatePath, isCrlfLineBreak, isEmbeddedNode) => {

    const elementList = ParseUtils.getElementList(content, templatePath, isCrlfLineBreak);
    const rootNode    = new IsmlNode(undefined, undefined, undefined, undefined, isEmbeddedNode);
    let currentParent = rootNode;

    for (let i = 0; i < elementList.length; i++) {
        const element = elementList[i];

        validateNodeHead(element, templatePath);

        const newNode = new IsmlNode(element.value, element.lineNumber, element.columnNumber, element.globalPos, isEmbeddedNode);

        const containerResult = parseContainerElements(element, currentParent, newNode, templatePath);

        currentParent = containerResult.currentParent;

        if (containerResult.shouldContinueLoop) {
            continue;
        }

        currentParent = parseNonContainerElements(element, currentParent, newNode, templatePath);
    }

    ParseUtils.checkBalance(rootNode, templatePath);

    rootNode.tree = {
        originalLineBreak : GeneralUtils.getFileLineBreakStyle(content),
    };

    return rootNode;
};

const parseContainerElements = (element, currentParent, newNode, templatePath) => {

    if (!currentParent.isContainerChild() && ['iselse', 'iselseif'].indexOf(element.tagType) >= 0) {
        throw ExceptionUtils.unbalancedElementError(
            currentParent.getType(),
            currentParent.lineNumber,
            currentParent.globalPos,
            currentParent.head.trim().length,
            templatePath
        );
    }

    if (currentParent.isContainerChild() && ['iselse', 'iselseif'].indexOf(element.tagType) >= 0 && element.isClosingTag) {
        throw ExceptionUtils.unexpectedClosingElementError(
            element.tagType,
            element.lineNumber,
            element.globalPos,
            element.value.trim().length,
            templatePath
        );
    }

    if (element.tagType === 'isif' && !element.isClosingTag) {
        const containerNode = new ContainerNode();
        currentParent.addChild(containerNode);
        containerNode.addChild(newNode);
        currentParent       = newNode;

        return {
            shouldContinueLoop : true,
            currentParent      : currentParent
        };

    } else if (element.tagType === 'iselse' || element.tagType === 'iselseif') {
        currentParent = currentParent.parent;
        currentParent.addChild(newNode);
        currentParent = newNode;

        return {
            shouldContinueLoop : true,
            currentParent      : currentParent
        };

    } else if (element.tagType === 'isif' && element.isClosingTag) {

        if (!currentParent.isOfType('iselseif') &&
            !currentParent.isOfType('iselse') &&
            currentParent.getType() !== element.tagType
        ) {
            throw ExceptionUtils.unbalancedElementError(
                currentParent.getType(),
                currentParent.lineNumber,
                currentParent.globalPos,
                currentParent.head.trim().length,
                templatePath
            );
        }

        currentParent.setTail(element.value, element.lineNumber, element.columnNumber, element.globalPos);
        currentParent = currentParent.parent.parent;

        return {
            shouldContinueLoop : true,
            currentParent      : currentParent
        };
    }

    return {
        shouldContinueLoop : false,
        currentParent      : currentParent
    };
};

const parseNonContainerElements = (element, currentParent, newNode, templatePath) => {
    if (element.isSelfClosing) {
        if (element.isClosingTag  && element.isVoidElement) {
            currentParent.getLastChild().setTail(element.value, element.lineNumber, element.columnNumber, element.globalPos);
        } else {
            currentParent.addChild(newNode);
        }
    } else if (!element.isClosingTag && element.tagType !== 'isif') {
        currentParent.addChild(newNode);

        if (!element.isSelfClosing) {
            currentParent = newNode;
        }
    } else if (element.isClosingTag) {

        const parentLastChild = currentParent.getLastChild();

        if (element.tagType === currentParent.getType()) {
            currentParent.setTail(element.value, element.lineNumber, element.columnNumber, element.globalPos);

        } else if (element.isCustomTag && element.tagType === parentLastChild.getType()) {
            parentLastChild.setTail(element.value, element.lineNumber, element.columnNumber, element.globalPos);

            currentParent = parentLastChild;

        } else if (element.isClosingTag && currentParent.isRoot()) {
            throw ExceptionUtils.unbalancedElementError(
                element.tagType,
                element.lineNumber,
                element.globalPos,
                element.value.trim().length,
                templatePath
            );
        } else if (element.isClosingTag) {
            throw ExceptionUtils.unexpectedClosingElementError(
                element.tagType,
                element.lineNumber,
                element.globalPos,
                element.value.trim().length,
                templatePath
            );
        } else {
            throw ExceptionUtils.unbalancedElementError(
                currentParent.getType(),
                currentParent.lineNumber,
                currentParent.globalPos,
                currentParent.value.trim().length,
                templatePath
            );
        }

        currentParent = currentParent.parent;

        if (element.tagType === 'isif' && element.isClosingTag) {
            currentParent = currentParent.parent;
        }
    }

    return currentParent;
};

const postProcess = (node, data = {}) => {
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        if (child.head.indexOf('template="util/modules"') >= 0) {
            data.moduleDefinition = {
                value      : child.head,
                lineNumber : child.lineNumber,
                globalPos  : child.globalPos,
                length     : child.head.trim().length
            };
        }

        if (child.isCustomIsmlTag()) {
            data.customModuleArray = data.customModuleArray || [];
            data.customModuleArray.push({
                value      : child.head,
                lineNumber : child.lineNumber,
                globalPos  : child.globalPos,
                length     : child.head.trim().length
            });
        }

        rectifyNodeIndentation(node, child);
        postProcess(child, data);
    }

    return data;
};

const build = (templatePath, content, isCrlfLineBreak) => {

    const ParseStatus = require('../enums/ParseStatus');

    const templateContent = content || fs.readFileSync(templatePath, 'utf-8');
    const result          = {
        originalLineBreak : GeneralUtils.getFileLineBreakStyle(templateContent),
        templatePath,
        status : ParseStatus.NO_ERRORS
    };

    try {
        const formattedTemplateContent = templateContent;
        result.rootNode                = parse(formattedTemplateContent, templatePath, isCrlfLineBreak);
        result.data                    = postProcess(result.rootNode);

        result.rootNode.tree = result;

    } catch (e) {
        result.rootNode  = null;
        result.status    = ParseStatus.INVALID_DOM;
        result.exception = e.type === ExceptionUtils.types.UNKNOWN_ERROR ?
            e.message :
            e;
    }

    return result;
};

/**
 * In the main part of tree build, a node A might hold the next node B's indentation in the last part of
 * A, be it in its value or tail value. This function removes that trailing indentation from A and
 * adds it to B as a leading indentation;
 */
const rectifyNodeIndentation = (node, child) => {
    const previousSibling = child.getPreviousSibling();

    if (child.isContainer()) {
        child = child.children[0];
    }

    if (previousSibling && previousSibling.isOfType('text')) {
        const trailingLineBreakQty = ParseUtils.getTrailingEmptyCharsQty(previousSibling.head);

        previousSibling.head = previousSibling.head.substring(0, previousSibling.head.length - trailingLineBreakQty);
        child.head           = ParseUtils.getBlankSpaceString(trailingLineBreakQty) + child.head;
    }

    if (child.isLastChild() && child.isOfType('text')) {
        let trailingLineBreakQty = 0;

        trailingLineBreakQty = ParseUtils.getTrailingEmptyCharsQty(child.head);
        child.head           = child.head.substring(0, child.head.length - trailingLineBreakQty);

        node.tail = ParseUtils.getBlankSpaceString(trailingLineBreakQty) + node.tail;
    }
};

const validateNodeHead = (element, templatePath) => {

    if (element.type !== 'text') {
        const trimmedElement = element.value.trim();
        const maskedElement  = MaskUtils.maskQuoteContent(trimmedElement);

        if (maskedElement.endsWith('_')) {
            throw ExceptionUtils.unbalancedQuotesError(
                element.tagType,
                element.lineNumber,
                element.globalPos,
                trimmedElement.length,
                templatePath
            );
        }
    }
};

module.exports.build = build;
module.exports.parse = parse;
