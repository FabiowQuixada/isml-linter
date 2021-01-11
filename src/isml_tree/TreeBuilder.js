const fs             = require('fs');
const IsmlNode       = require('./IsmlNode');
const ParseUtils     = require('./ParseUtils');
const ContainerNode  = require('./ContainerNode');
const ExceptionUtils = require('../util/ExceptionUtils');
const GeneralUtils   = require('../util/GeneralUtils');

const parse = (content, templatePath) => {

    const elementList = ParseUtils.getElementList(content, templatePath);
    const rootNode    = new IsmlNode();
    let currentParent = rootNode;

    for (let i = 0; i < elementList.length; i++) {
        const element = elementList[i];
        const newNode = new IsmlNode(element.value, element.lineNumber, element.globalPos);

        const containerResult = parseContainerElements(element, currentParent, newNode, templatePath);

        currentParent = containerResult.currentParent;

        if (containerResult.continue) {
            continue;
        }

        currentParent = parseNonContainerElements(element, currentParent, newNode, templatePath);
    }

    ParseUtils.checkBalance(rootNode, templatePath);

    return rootNode;
};

const parseContainerElements = (element, currentParent, newNode, templatePath) => {

    if (element.tagType === 'isif' && !element.isClosingTag) {
        const containerNode = new ContainerNode();
        currentParent.addChild(containerNode);
        containerNode.addChild(newNode);
        currentParent       = newNode;

        return {
            continue      : true,
            currentParent : currentParent
        };

    } else if (element.tagType === 'iselse' || element.tagType === 'iselseif') {
        currentParent = currentParent.parent;
        currentParent.addChild(newNode);
        currentParent = newNode;

        return {
            continue      : true,
            currentParent : currentParent
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
                currentParent.value.trim().length,
                templatePath
            );
        }

        currentParent.setSuffix(element.value, element.lineNumber, element.globalPos);
        currentParent = currentParent.parent.parent;

        return {
            continue      : true,
            currentParent : currentParent
        };
    }

    return {
        continue      : false,
        currentParent : currentParent
    };
};

const parseNonContainerElements = (element, currentParent, newNode, templatePath) => {
    if (element.isSelfClosing) {
        currentParent.addChild(newNode);
    } else if (!element.isClosingTag && element.tagType !== 'isif') {
        currentParent.addChild(newNode);

        if (!element.isSelfClosing) {
            currentParent = newNode;
        }
    } else if (element.isClosingTag) {

        if (element.tagType === currentParent.getType()) {
            currentParent.setSuffix(element.value, element.lineNumber, element.globalPos);

        } else if (element.isClosingTag && currentParent.isRoot()) {
            throw ExceptionUtils.unbalancedElementError(
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

        if (child.value.indexOf('template="util/modules"') !== -1) {
            data.moduleDefinition = {
                value      : child.value,
                lineNumber : child.lineNumber,
                globalPos  : child.globalPos,
                length     : child.value.trim().length
            };
        }

        if (child.isCustomIsmlTag()) {
            data.customModuleArray = data.customModuleArray || [];
            data.customModuleArray.push({
                value      : child.value,
                lineNumber : child.lineNumber,
                globalPos  : child.globalPos,
                length     : child.value.trim().length
            });
        }

        postProcess(child, data);
    }

    return data;
};

const build = (templatePath, content) => {

    const ParseStatus = require('../enums/ParseStatus');

    const result = {
        templatePath,
        status : ParseStatus.NO_ERRORS
    };

    try {
        const templateContent = GeneralUtils.toLF(content || fs.readFileSync(templatePath, 'utf-8'));
        result.rootNode       = parse(templateContent, templatePath);
        result.data           = postProcess(result.rootNode);

    } catch (e) {
        result.rootNode  = null;
        result.status    = ParseStatus.INVALID_DOM;
        result.exception = e.type === ExceptionUtils.types.UNKNOWN_ERROR ?
            e.message :
            e;
    }

    return result;
};

module.exports.build = build;
module.exports.parse = parse;
