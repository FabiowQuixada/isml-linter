const MAX_TEXT_DISPLAY_SIZE = 30;

const ConfigUtils      = require('../util/ConfigUtils');
const Constants        = require('../Constants');
const SfccTagContainer = require('../enums/SfccTagContainer');
const ParseUtils       = require('./ParseUtils');
const MaskUtils        = require('./MaskUtils');
const ExceptionUtils   = require('../util/ExceptionUtils');
const GeneralUtils     = require('../util/GeneralUtils');

let ID_COUNTER = 0;

class IsmlNode {

    /**
     * @param {String} head            node opening tag value, including attributes
     * @param {Number} lineNumber      node starting line number
     * @param {Number} columnNumber    node starting column number
     * @param {Number} globalPos       node starting position since the beginning of the file
     * @param {Boolean} isEmbeddedNode whether the node is part of an embedded "sub tree", as a tag attribute
     */
    constructor(head = '(root)', lineNumber = 0, columnNumber, globalPos, isEmbeddedNode) {
        this.id               = ID_COUNTER++;
        this.head             = head;          // '<div class="my_class">'
        this.lineNumber       = lineNumber;    // 7
        this.columnNumber     = columnNumber;  // 12
        this.endLineNumber    = lineNumber + ParseUtils.getLineBreakQty(head.trim()); // 9
        this.globalPos        = globalPos;     // 184
        this.depth            = 0;             // Isml dom tree node depth
        this.tail             = '';            // '</div>'
        this.tailLineNumber   = null;          // 9
        this.tailColumnNumber = null;          // 12
        this.tailGlobalPos    = null;          // 207
        this.parent           = null;          // Parent isml node;
        this.children         = [];            // Child isml nodes;
        this.childNo          = 0;
        this.isEmbeddedNode   = !!isEmbeddedNode;
    }

    // Tail is the element corresponding closing tag, such as </div>
    setTail(value, lineNumber, columnNumber, globalPos) {
        this.tail              += value;
        this.tailLineNumber    = lineNumber;
        this.tailColumnNumber  = columnNumber;
        this.tailGlobalPos     = globalPos;
        this.tailEndLineNumber = lineNumber;
    }

    // Returns a string. Examples: 'div', 'isprint', 'doctype';
    getType() {
        if (this.parent && this.parent.isOfType('iscomment')) {
            return 'text';
        }

        const head = this.head.trim();

        if (head.startsWith('<!--[if')) {
            return 'html_conditional_comment';
        } else if (head.startsWith('<!--')) {
            return 'html_comment';
        } else if (this.isDocType()) {
            return 'doctype';
        } else if (this.isDynamicElement()) {
            return 'dynamic_element';
        } else if (this.isContainer()) {
            return 'container';
        } else if (!head) {
            return 'empty';
        } else if (head === '(root)') {
            return 'root';
        } else if (!this.isTag()) {
            return 'text';
        }

        const regex = /<[a-zA-Z\d_-]*(\s|>|\/)/g;

        return head.match(regex)[0].slice(1, -1);
    }

    getLastLineNumber() {
        return this.tailLineNumber ?
            this.tailLineNumber :
            this.endLineNumber;
    }

    isDocType() {
        return this.head.toLowerCase().trim().startsWith('<!doctype ');
    }

    // Checks if the node type is dynamically set, such in:
    // <${aPdictVariable} />
    isDynamicElement() {
        return this.head.trim().startsWith('<${');
    }

    isInSameLineAsParent() {
        return this.parent && !this.parent.isContainer() && this.parent.lineNumber === this.lineNumber;
    }

    isInSameLineAsParentEnd() {
        return this.parent && !this.parent.isContainer() && this.parent.endLineNumber === this.lineNumber;
    }

    isMultiLineOpeningTag() {
        return this.isTag() && ParseUtils.getLineBreakQty(this.head.trim()) > 0;
    }

    isInSameLineAsPreviousSibling() {
        const previousSibling = this.getPreviousSibling();
        return previousSibling && previousSibling.getLastLineNumber() === this.lineNumber;
    }

    /**
     * Gets an array of attributes. For <div class="my_class_1 my my_class_2" style="fancy">, returns:
     *
     * [
     *      {
     *         name   : 'class',
     *         value  : 'my_class_1 my my_class_2',
     *         valueList : ['my_class_1', 'my_class_2']
     *      },
     *      {
     *         name   : 'style',
     *         value  : 'fancy',
     *         valueList : ['fancy']
     *      }
     * ]
     */
    getAttributeList() {
        if (!this.isHtmlTag() && !this.isIsmlTag() || this.isConditionalComment()) {
            return [];
        }

        return getAttributes(this);
    }

    getAttr(name) {
        return this.getAttributeList().find( attr => attr.label === name );
    }

    addChild(newNode) {
        if (newNode.head.trim()) {
            newNode.depth        = this.depth + 1;
            newNode.parent       = this;
            newNode.childNo      = this.children.length;
            this.children.push(newNode);
            this.newestChildNode = newNode;
        } else {
            this.tail = newNode.head + this.tail;
        }

        newNode.isEmbeddedNode = this.isEmbeddedNode;
    }

    getChild(number) { return this.children[number];                   }
    getLastChild()   { return this.children[this.children.length - 1]; }
    getChildrenQty() { return this.children.length;                    }
    hasChildren()    { return this.children.length > 0;                }

    getIndentationSize() {
        return getNodeIndentationSize(this, true);
    }

    getTailIndentationSize() {
        return getNodeIndentationSize(this, false);
    }

    isRoot() { return !this.parent; }

    // Always returns false. It is true only for the container elements, please check ContainerNode class;
    isContainer() { return false; }

    isContainerChild() {
        return this.parent && this.parent.isContainer();
    }

    isScriptContent() {
        return this.parent && this.parent.isOfType('isscript');
    }

    isTag() {
        const value = this.head.trim();

        return value.startsWith('<') &&
            value.endsWith('>');
    }

    isHtmlTag() {
        const value = this.head.trim();

        return value.startsWith('<') &&
            !value.startsWith('<is') &&
            value.endsWith('>');
    }

    isIsmlTag() {
        return this.head.trim().startsWith('<is');
    }

    isStandardIsmlTag() {
        return !!SfccTagContainer[this.getType()];
    }

    isCustomIsmlTag() {
        return this.isIsmlTag() && !this.isStandardIsmlTag();
    }

    isDescendantOf(nodeType) {
        let iterator = this.parent;

        while (iterator !== null) {
            if (iterator.isOfType(nodeType)) {
                return true;
            }

            iterator = iterator.parent;
        }

        return false;
    }

    // For an unwrapped ${someVariable} element, returns true;
    // For tags and hardcoded strings          , returns false;
    isExpression() {
        const value = this.head.trim();

        return value.startsWith('${') &&
            value.endsWith('}');
    }

    isIsmlComment() {
        const value = this.head.trim();

        return value === '<iscomment>';
    }

    isIsscriptContent() {
        return this.parent && this.parent.getType() === 'isscript';
    }

    isHtmlComment() {
        const value = this.head.trim();

        return value.startsWith('<!--') &&
            value.endsWith('-->');
    }

    isConditionalComment() {
        const value = this.head.trim();

        return value.startsWith('<!--[');
    }

    isCommentContent() {
        return this.parent && this.parent.isIsmlComment();
    }

    isHardCodedText() {
        return !this.isRoot()
            && !this.isContainer()
            && !this.isConditionalComment()
            && !this.isTag()
            && !this.isExpression();
    }

    getPreviousSibling() {
        if (!this.parent || !this.parent.isContainer() && this.isFirstChild() || this.parent.isContainer() && this.parent.isFirstChild() && this.isFirstChild()) {
            return null;
        }

        const sibling = this.parent.isContainer() && this.isFirstChild() ?
            this.parent.parent.children[this.parent.childNo - 1] :
            this.parent.children[this.childNo - 1];

        if (sibling.isContainer()) {
            return sibling.children[0];
        }

        return sibling;
    }

    getNextSibling() {
        if (!this.parent || this.parent.children.length < this.childNo) {
            return null;
        }

        const sibling = this.parent.children[this.childNo + 1];

        if (sibling.isContainer()) {
            return sibling.children[0];
        }

        return sibling;
    }

    getTrailingValue() {
        return this.tail || this.head;
    }

    // Checks if node is HTML 5 void element;
    isVoidElement() {
        const config = ConfigUtils.load();

        return !config.disableHtml5 && Constants.voidElementsArray.indexOf(this.getType()) >= 0;
    }

    // For <div />    , returns true;
    // For <div></div>, returns false;
    isSelfClosing() {
        return !this.isContainer() && (
            this.isDocType() ||
            this.isVoidElement() ||
            this.isHtmlComment() ||
            this.isTag() && this.head.trim().endsWith('/>')) ||
            this.isCustomIsmlTag() ||
            this.isIsmlTag() && SfccTagContainer[this.getType()] && SfccTagContainer[this.getType()]['self-closing'];
    }

    isOfType(type) {
        return typeof type === 'string' ?
            !this.isRoot() && this.getType() === type :
            type.some( elem => elem === this.getType());
    }

    isOneOfTypes(typeArray) {
        for (let i = 0; i < typeArray.length; i++) {
            if (this.isOfType(typeArray[i])) {
                return true;
            }
        }

        return false;
    }

    isEmpty() {
        return !this.head.trim();
    }

    isFirstChild() {
        if (this.isRoot()) {
            return false;
        }

        const firstChild = this.parent.children[0];

        return this.lineNumber === firstChild.lineNumber &&
            this.head === firstChild.head;
    }

    isLastChild()  {
        return !this.parent || this.parent.getLastChild() === this;
    }

    // No position or line number is set. To get
    // it, it is necessary to re-parse the tree.
    // This is valid for all nodes;
    removeChild(node) {
        let index = null;

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];

            if (child.id === node.id) {
                index = i;
                break;
            }
        }

        const removedNode = this.children[index];
        this.children.splice(index, 1);

        for (let i = 0; i < this.children.length; i++) {
            const child   = this.children[index];
            child.childNo = i;
        }

        return removedNode;
    }

    // No position or line number is set. To get
    // it, it is necessary to re-parse the tree.
    // This is valid for all nodes;
    addChildNodeToPos(node, index) {
        node.parent = this;
        node.depth  = this.depth + 1;
        this.children.splice(index, 0, node);

        for (let i = 0; i < this.children.length; i++) {
            const child   = this.children[i];
            child.childNo = i;
        }
    }

    getRoot() {
        let rootNode = this;

        while (rootNode.parent) {
            rootNode = rootNode.parent;
        }

        return rootNode;
    }

    toString() {

        let stream = privateToString(this);

        stream = GeneralUtils.applyLineBreak(stream, this.getRoot().tree.originalLineBreak);

        return stream;
    }

    // Used for debugging purposes only;
    print() {
        const indentSize = this.depth;
        let indentation  = '';

        for (let i = 0; i < indentSize; ++i) {
            indentation += '    ';
        }

        if(this.isRoot()) {
            console.log('Depth\t :: LineNumber\t :: Content');
        }

        console.log(this.depth + '\t :: ' + this.lineNumber + '\t\t :: ' + indentation + getDisplayText(this));

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].print();
        }
    }
}

/**
 * PRIVATE FUNCTIONS
 *
 * The following are "private" spyOnAllFunctions, which
 * will be available for use only within IsmlNode methods;
*/

const privateToString = (node, stream = '') => {
    if (!node.isContainer() && node.isEmpty() && !node.isLastChild()) {
        return stream;
    }

    if (!node.isRoot() && !node.isContainer()) {
        stream += node.head;
    }

    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        stream      = privateToString(child, stream);
    }

    if (!node.isRoot() && !node.isContainer()) {
        stream += node.tail;
    }

    return stream;
};

const getAttributes = node => {
    const trimmedHead           = node.head.trim();
    const nodeHead              = trimmedHead.substring(1, trimmedHead.length - 1);
    const firstSpaceAfterTagPos = ParseUtils.getFirstEmptyCharPos(trimmedHead);
    const leadingEmptySpaceQty  = ParseUtils.getNextNonEmptyCharPos(nodeHead);
    const afterTagContent       = nodeHead.substring(leadingEmptySpaceQty + firstSpaceAfterTagPos);
    const rawAttributeList      = getStringifiedAttributeArray(afterTagContent.trim());
    const attributeList         = [];

    for (let i = 0; i < rawAttributeList.length; i++) {
        const attr = parseAttribute(node, rawAttributeList, attributeList, i);
        attributeList.push(attr);
    }

    return attributeList;
};

// Used for debugging purposes only;
const getDisplayText = node => {
    let displayText = node.head;

    displayText = displayText
        .replace(new RegExp(Constants.EOL, 'g'), '')
        .replace(/ +(?= )/g, '');

    if (node.head.length > MAX_TEXT_DISPLAY_SIZE - 3) {
        displayText = displayText.substring(0, MAX_TEXT_DISPLAY_SIZE - 3) + '...';
    }

    return displayText.trim();
};

const getProcessedContent = content => {
    let processedContent = content;

    processedContent = MaskUtils.maskExpressionContent(processedContent);
    processedContent = MaskUtils.maskIsifTagContent(processedContent);
    processedContent = MaskUtils.maskIsprintTagContent(processedContent);
    processedContent = MaskUtils.maskJsonContent(processedContent);
    processedContent = MaskUtils.maskQuoteContent(processedContent);
    processedContent = processedContent.replace(new RegExp(Constants.EOL, 'g'), ' ');

    if (processedContent.endsWith('/')) {
        processedContent = processedContent.slice(0, -1) + ' ';
    }

    return processedContent;
};

const getStringifiedAttributeArray = content => {
    const maskedContent    = getProcessedContent(content);
    const attrStartPosList = [];
    const result           = [];

    const maskedAttributeList = maskedContent
        .replace(/><+/g, '> <')
        .replace(/"</g, '" <')
        .replace(/\s\s+/g, ' ')
        .split(' ')
        .filter(attr => attr);

    for (let i = 0; i < maskedContent.length; i++) {
        if (i === 0 && maskedContent[i] !== ' ') {
            attrStartPosList.push(i);
        } else if (maskedContent[i - 1] === ' ' && maskedContent[i] !== ' ' || maskedContent[i - 1] === '>' && maskedContent[i] === '<') {
            attrStartPosList.push(i);
        } else if (maskedContent[i - 1] === '"' && maskedContent[i] === '<') {
            attrStartPosList.push(i + 1);
        }
    }

    for (let i = 0; i < maskedAttributeList.length; i++) {
        let fullAttribute = content.substring(attrStartPosList[i] - 1, attrStartPosList[i] + maskedAttributeList[i].length).trim();

        if (fullAttribute.endsWith('/')) {
            fullAttribute = fullAttribute.slice(0, -1) + ' ';
        }

        result.push(fullAttribute);
    }

    return result;
};

const parseAttribute = (node, rawAttributeList, resultingAttributeList, index) => {
    const attribute                             = rawAttributeList[index];
    const isAttributeANestedIsmlTag             = attribute.startsWith('<is');
    const isExpressionAttribute                 = attribute.startsWith('${') && attribute.endsWith('}');
    const trimmedAttribute                      = attribute.trim();
    const trimmedNodeHead                       = node.head.trim();
    const localPos                              = getAttributeLocalPos(node, trimmedNodeHead, trimmedAttribute);
    const leadingContent                        = trimmedNodeHead.substring(0, localPos);
    const leadingLineBreakQty                   = ParseUtils.getLineBreakQty(leadingContent);
    const isInSameLineAsTagName                 = leadingLineBreakQty === 0;
    const assignmentCharPos                     = trimmedAttribute.indexOf('=');
    const name                                  = assignmentCharPos >= 0 ? trimmedAttribute.substring(0, assignmentCharPos) : trimmedAttribute;
    const value                                 = assignmentCharPos >= 0 ? trimmedAttribute.substring(assignmentCharPos + 2, trimmedAttribute.length - 1) : null;
    const valueList                             = getAttributeValueList(value);
    const attrLocalPos                          = trimmedNodeHead.indexOf(trimmedAttribute);
    const valueLocalPos                         = trimmedAttribute.indexOf(value);
    const lineNumber                            = node.lineNumber + leadingLineBreakQty;
    const globalPos                             = node.globalPos + localPos + leadingLineBreakQty - lineNumber + 1;
    const hasMultilineValue                     = value && value.indexOf(Constants.EOL) >= 0;
    const isFirstValueInSameLineAsAttributeName = value && ParseUtils.getLeadingLineBreakQty(value) === 0;
    const quoteChar                             = getQuoteChar(trimmedAttribute);
    const attributeNameFirstLine                = name.split(Constants.EOL)[0];
    const isInSameLineAsPreviousAttribute       = index >= 1 && resultingAttributeList[index - 1].lineNumber === lineNumber;

    const columnNumber = isInSameLineAsTagName ?
        node.columnNumber + leadingContent.length :
        leadingContent.length - leadingContent.lastIndexOf(Constants.EOL);

    const isFirstInLine = !isInSameLineAsTagName
        && trimmedNodeHead
            .split(Constants.EOL)
            .find(attrLine => attrLine.indexOf(attributeNameFirstLine) >= 0)
            .trim()
            .indexOf(attributeNameFirstLine) === 0;

    if (isAttributeANestedIsmlTag || isExpressionAttribute) {
        return {
            name            : trimmedAttribute,
            value           : null,
            valueList       : null,
            localPos,
            globalPos,
            lineNumber,
            columnNumber,
            index,
            isInSameLineAsTagName,
            isFirstInLine,
            isFirstValueInSameLineAsAttributeName,
            isInSameLineAsPreviousAttribute,
            isExpressionAttribute,
            hasMultilineValue,
            isNestedIsmlTag : isAttributeANestedIsmlTag,
            length          : trimmedAttribute.length + ParseUtils.getLineBreakQty(trimmedAttribute),
            fullContent     : trimmedAttribute,
            quoteChar,
            node
        };

    } else {
        return {
            name,
            value,
            valueList,
            localPos,
            globalPos,
            lineNumber,
            columnNumber,
            index,
            isInSameLineAsTagName,
            isFirstInLine,
            isFirstValueInSameLineAsAttributeName,
            isInSameLineAsPreviousAttribute,
            isExpressionAttribute,
            hasMultilineValue,
            isNestedIsmlTag: isAttributeANestedIsmlTag,
            length         : trimmedAttribute.length,
            attrGlobalPos  : node.globalPos + attrLocalPos,
            valueGlobalPos : node.globalPos + valueLocalPos,
            fullContent    : trimmedAttribute,
            quoteChar,
            node
        };
    }
};

/**
 * Two attributes can have the same name, and that is handled here;
 */
const getAttributeLocalPos = (node, trimmedNodeHead, trimmedAttribute) => {
    const maskedTrimmedAttribute = MaskUtils.maskQuoteContent(trimmedAttribute);
    const maskedTrimmedNodeHead  = MaskUtils.maskQuoteContent(trimmedNodeHead);

    let attributeLocalPos    = maskedTrimmedNodeHead.indexOf(maskedTrimmedAttribute);
    const isCorrectAttribute = trimmedNodeHead.indexOf(trimmedAttribute) === attributeLocalPos;
    let remainingNodeHead    = maskedTrimmedNodeHead.substring(attributeLocalPos + 1);

    const maxLoops = 500;
    let loopQty    = 0;

    while (!isCorrectAttribute) {
        const tempLocalPos = remainingNodeHead.indexOf(maskedTrimmedAttribute) + 1;

        attributeLocalPos += tempLocalPos;

        const remainingContent = trimmedNodeHead.substring(attributeLocalPos);

        if (remainingContent.startsWith(trimmedAttribute)) {
            break;
        }

        remainingNodeHead = remainingNodeHead.substring(tempLocalPos);

        loopQty++;

        if (loopQty >= maxLoops) {
            throw ExceptionUtils.parseError(
                node.getType(),
                node.lineNumber,
                node.globalPos,
                node.head.length,
                node.getRoot().tree.templatePath
            );
        }
    }

    return attributeLocalPos;
};

const getNodeIndentationSize = (node, isNodeHead) => {

    if (node.isContainer()) {
        return 0;
    }

    const content                    = isNodeHead ? node.head : node.tail;
    const precedingEmptySpacesLength = content.search(/\S|$/);
    const fullPrecedingEmptySpaces   = content.substring(0, precedingEmptySpacesLength);
    const lineBreakLastPos           = Math.max(fullPrecedingEmptySpaces.lastIndexOf(Constants.EOL), 0);
    const precedingEmptySpaces       = content.substring(lineBreakLastPos, precedingEmptySpacesLength).replace(new RegExp(Constants.EOL, 'g'), '');
    const lastLineBreakPos           = Math.max(precedingEmptySpaces.lastIndexOf(Constants.EOL), 0);
    const indentationSize            = precedingEmptySpaces.substring(lastLineBreakPos).length;

    return Math.max(indentationSize, 0);
};

const getAttributeValueList = fullContent => {

    if (!fullContent) {
        return null;
    }

    const maskedFullContent  = MaskUtils.maskIgnorableContent(fullContent).trim();
    const maskedValueList    = maskedFullContent.split(/[\s\n]+/).filter( val => val );
    const trimmedFullContent = fullContent.trim();
    const valueList          = [];

    for (let i = 0; i < maskedValueList.length; i++) {
        const maskedValueElement = maskedValueList[i];
        const index              = maskedFullContent.indexOf(maskedValueElement);
        const value              = trimmedFullContent.substring(index, index + maskedValueElement.length);

        valueList.push(value);
    }

    return valueList;
};

const getQuoteChar = trimmedAttribute => {
    const assignmentCharPos = trimmedAttribute.indexOf('=');

    if (assignmentCharPos >= 0) {
        if (trimmedAttribute.substring(assignmentCharPos + 1).startsWith('\'')) {
            return '\'';
        }

        if (trimmedAttribute.substring(assignmentCharPos + 1).startsWith('"')) {
            return '"';
        }
    }

    return '';
};

module.exports = IsmlNode;
