const MAX_TEXT_DISPLAY_SIZE = 30;

const ConfigUtils = require('../util/ConfigUtils');
const Constants   = require('../Constants');
const SfccTags    = require('../enums/SfccTags');
const ParseUtils  = require('./ParseUtils');
const MaskUtils   = require('./MaskUtils');

let ID_COUNTER = 0;

class IsmlNode {

    /**
     * @param {String} value      node opening tag value, including attributes
     * @param {Number} lineNumber node starting line number
     * @param {Number} globalPos  node starting position since the beginning of the file
     */
    constructor(value = '(root)', lineNumber = 0, columnNumber, globalPos) {
        this.id                 = ID_COUNTER++;
        this.value              = value;         // '<div class="my_class">'
        this.lineNumber         = lineNumber;    // 7
        this.columnNumber       = columnNumber;  // 12
        this.endLineNumber      = lineNumber + ParseUtils.getLineBreakQty(value.trim()); // 9
        this.globalPos          = globalPos;     // 184
        this.depth              = 0;             // Isml dom tree node depth
        this.suffixValue        = '';            // '</div>'
        this.suffixLineNumber   = -1;            // 9
        this.suffixColumnNumber = -1;            // 12
        this.suffixGlobalPos    = -1;            // 207
        this.parent             = null;          // Parent isml node;
        this.children           = [];            // Child isml nodes;
        this.childNo            = 0;
    }

    // Suffix is the element corresponding closing tag, such as </div>
    setSuffix(value, lineNumber, columnNumber, globalPos) {
        this.suffixValue         += value;
        this.suffixLineNumber    = lineNumber;
        this.suffixColumnNumber  = columnNumber;
        this.suffixGlobalPos     = globalPos;
        this.suffixEndLineNumber = lineNumber;
    }

    // Returns a string. Examples: 'div', 'isprint', 'doctype';
    getType() {
        if (this.parent && this.parent.isOfType('iscomment')) {
            return 'text';
        }

        const value = this.value.trim();

        if (value.startsWith('<!--')) {
            return 'html_comment';
        } else if (this.isDocType()) {
            return 'doctype';
        } else if (this.isDynamicElement()) {
            return 'dynamic_element';
        } else if (this.isContainer()) {
            return 'multi_clause';
        } else if (!value) {
            return 'empty';
        } else if (value === '(root)') {
            return 'root';
        } else if (!this.isTag()) {
            return 'text';
        }

        const regex = /<[a-zA-Z\d_]*(\s|>|\/)/g;

        return value.match(regex)[0].slice(1, -1);
    }

    getLastLineNumber() {
        return this.suffixLineNumber !== -1 ?
            this.suffixLineNumber :
            this.endLineNumber;
    }

    isDocType() {
        return this.value.toLowerCase().trim().startsWith('<!doctype ');
    }

    // Checks if the node type is dynamically set, such in:
    // <${aPdictVariable} />
    isDynamicElement() {
        return this.value.trim().startsWith('<${');
    }

    isInSameLineAsParent() {
        return this.parent && !this.parent.isContainer() && this.parent.lineNumber === this.lineNumber;
    }

    isInSameLineAsParentEnd() {
        return this.parent && !this.parent.isContainer() && this.parent.endLineNumber === this.lineNumber;
    }

    isMultiLineOpeningTag() {
        return this.isTag() && ParseUtils.getLineBreakQty(this.value.trim()) > 0;
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
     *         values : ['my_class_1', 'my_class_2']
     *      },
     *      {
     *         name   : 'style',
     *         value  : 'fancy',
     *         values : ['fancy']
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
        if (newNode.value.trim()) {
            newNode.depth        = this.depth + 1;
            newNode.parent       = this;
            newNode.childNo      = this.children.length;
            this.children.push(newNode);
            this.newestChildNode = newNode;
        } else {
            this.suffixValue = newNode.value + this.suffixValue;
        }
    }

    getLastChild()        { return this.children[this.children.length - 1]; }
    getNumberOfChildren() { return this.children.length;                    }
    hasChildren()         { return this.children.length > 0;                }

    getIndentationSize() {
        return getNodeIndentationSize(this, true);
    }

    getSuffixIndentationSize() {
        return getNodeIndentationSize(this, false);
    }

    isRoot() { return !this.parent; }

    // Always returns false. It is true only for the container elements, please check ContainerNode class;
    isContainer() { return false; }

    isScriptContent() {
        return this.parent && this.parent.isOfType('isscript');
    }

    isTag() {
        const value = this.value.trim();

        return value.startsWith('<') &&
            value.endsWith('>');
    }

    isHtmlTag() {
        const value = this.value.trim();

        return value.startsWith('<') &&
            !value.startsWith('<is') &&
            value.endsWith('>');
    }

    isIsmlTag() {
        return this.value.trim().startsWith('<is');
    }

    isStandardIsmlTag() {
        return !!SfccTags[this.getType()];
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
        const value = this.value.trim();

        return value.startsWith('${') &&
            value.endsWith('}');
    }

    isIsmlComment() {
        const value = this.value.trim();

        return value === '<iscomment>';
    }

    isIsscriptContent() {
        return this.parent && this.parent.getType() === 'isscript';
    }

    isHtmlComment() {
        const value = this.value.trim();

        return value.startsWith('<!--') &&
            value.endsWith('-->');
    }

    isConditionalComment() {
        const value = this.value.trim();

        return value.startsWith('<!--[');
    }

    isCommentContent() {
        return this.parent && this.parent.isIsmlComment();
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
        return this.suffixValue || this.value;
    }

    // Checks if node is HTML 5 void element;
    isVoidElement() {
        const config = ConfigUtils.load();

        return !config.disableHtml5 && Constants.voidElementsArray.indexOf(this.getType()) !== -1;
    }

    // For <div />    , returns true;
    // For <div></div>, returns false;
    isSelfClosing() {
        return !this.isContainer() && (
            this.isDocType() ||
            this.isVoidElement() ||
            this.isHtmlComment() ||
            this.isTag() && this.value.trim().endsWith('/>')) ||
            this.isCustomIsmlTag() ||
            this.isIsmlTag() && SfccTags[this.getType()] && SfccTags[this.getType()]['self-closing'];
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
        return !this.value.trim();
    }

    isFirstChild() {
        if (this.isRoot()) {
            return false;
        }

        const firstChild = this.parent.children[0];

        return this.lineNumber === firstChild.lineNumber &&
            this.value === firstChild.value;
    }

    isLastChild()  {
        return !this.parent || this.parent.getLastChild() === this;
    }

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
        return removedNode;
    }

    // No position or line number is set. To get
    // it, it is necessary to re-parse the tree;
    addChildNodeToPos(node, index) {
        node.parent = this;
        node.depth  = this.depth + 1;
        this.children.splice(index, 0, node);
    }

    toString(stream = '') {

        if (!this.isContainer() && this.isEmpty() && !this.isLastChild()) {
            return stream;
        }

        if (!this.isRoot() && !this.isContainer()) {
            stream += this.value;
        }

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            stream      = child.toString(stream);
        }

        if (!this.isRoot() && !this.isContainer()) {
            stream += this.suffixValue;
        }

        return stream;
    }

    // Used for debugging purposes only;
    print() {
        const indentSize = this.depth;
        let indentation  = '';

        for (let i = 0; i < indentSize; ++i) {
            indentation += '    ';
        }

        console.log(this.depth + ' :: ' + this.lineNumber + ' :: ' + indentation + getDisplayText(this));

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

const getAttributes = node => {
    const trimmedValue             = node.value.trim();
    const nodeValue                = trimmedValue.substring(1, trimmedValue.length - 1);
    const rawAttrNodeValue         = nodeValue.split(' ').slice(1).join(' ');
    const stringifiedAttributeList = getStringifiedAttributeArray(rawAttrNodeValue);
    const attributeList            = [];

    for (let i = 0; i < stringifiedAttributeList.length; i++) {
        const attr = parseAttribute(stringifiedAttributeList[i], node);
        attributeList.push(attr);
    }

    return attributeList;
};

// Used for debugging purposes only;
const getDisplayText = node => {
    let displayText = node.value;

    displayText = displayText
        .replace(new RegExp(Constants.EOL, 'g'), '')
        .replace(/ +(?= )/g, '');

    if (node.value.length > MAX_TEXT_DISPLAY_SIZE - 3) {
        displayText = displayText.substring(0, MAX_TEXT_DISPLAY_SIZE - 3) + '...';
    }

    return displayText.trim();
};

const getProcessedContent = content => {
    const partialResult0 = MaskUtils.maskInBetween(content, 'isif', null, true);
    const partialResult1 = MaskUtils.maskIgnorableContent(partialResult0);
    const partialResult2 = MaskUtils.maskIgnorableContent(partialResult1, '"', '"', true);

    let result = partialResult2.replace(new RegExp(Constants.EOL, 'g'), ' ');

    if (result.endsWith('/')) {
        result = result.slice(0, -1) + ' ';
    }

    return result;
};

const getMaskedContent = content => {
    let isWithinQuotes = false;
    let maskedContent  = '';

    for (let i = 0; i < content.length; i++) {
        const char = content[i];

        if (char === '"' && isWithinQuotes) {
            isWithinQuotes = false;
        } else if (char === '"') {
            isWithinQuotes = true;
        }

        maskedContent += isWithinQuotes || char === '"'  ?
            '_' :
            char;
    }

    return maskedContent;
};

const getStringifiedAttributeArray = content => {
    const processedContent = getProcessedContent(content);
    const maskedContent    = getMaskedContent(processedContent);

    const attributeList = maskedContent
        .replace(/\s\s+/g, ' ')
        .split(' ')
        .filter(attr => attr);

    const attrStartPosList = attributeList.map(attr => maskedContent.indexOf(attr));
    const attrLengthList   = attributeList.map(attr => attr.length);
    const result           = [];

    for (let i = 0; i < attributeList.length; i++) {
        const fullAttribute = content.substring(attrStartPosList[i], attrStartPosList[i] + attrLengthList[i]);
        result.push(fullAttribute);
    }

    return result;
};

const parseAttribute = (attribute, node) => {
    const isAttributeANestedIsmlTag = attribute.startsWith('<is');
    const trimmedAttribute          = attribute.trim();
    const trimmedNodeValue          = node.value.trim();
    const localPos                  = trimmedNodeValue.indexOf(trimmedAttribute);
    const leadingContent            = trimmedNodeValue.substring(0, localPos);
    const leadingLineBreakQty       = ParseUtils.getLineBreakQty(leadingContent);
    const isInSameLineAsTagName     = leadingLineBreakQty === 0;
    const attributeProps            = trimmedAttribute.split('=');
    const name                      = attributeProps[0].trim();
    const value                     = attributeProps[1] ? attributeProps[1].substring(1, attributeProps[1].length - 1) : null;
    const values                    = value ? value.split(/[\s\n]+/).filter( val => val ) : null;
    const attrLocalPos              = trimmedNodeValue.indexOf(trimmedAttribute);
    const valueLocalPos             = trimmedAttribute.indexOf(value);
    const globalPos                 = node.globalPos + localPos + leadingLineBreakQty;
    const lineNumber                = node.lineNumber + leadingLineBreakQty;
    const hasMultilineValue         = value && value.indexOf(Constants.EOL) >= 0;

    const columnNumber = isInSameLineAsTagName ?
        node.columnNumber + leadingContent.length :
        leadingContent.length - leadingContent.lastIndexOf(Constants.EOL);

    const isFirstInLine = !isInSameLineAsTagName && trimmedNodeValue
        .split(Constants.EOL)
        .find(attrLine => attrLine.indexOf(name) !== -1)
        .trim()
        .indexOf(name) === 0;

    if (isAttributeANestedIsmlTag) {
        return {
            name,
            localPos,
            globalPos,
            lineNumber,
            columnNumber,
            isInSameLineAsTagName,
            isFirstInLine,
            hasMultilineValue,
            isNestedIsmlTag: isAttributeANestedIsmlTag,
            length         : trimmedAttribute.length + ParseUtils.getLineBreakQty(trimmedAttribute),
            fullValue      : trimmedAttribute,
            node
        };

    } else {
        return {
            name,
            value,
            values,
            localPos,
            globalPos,
            lineNumber,
            columnNumber,
            isInSameLineAsTagName,
            isFirstInLine,
            hasMultilineValue,
            isNestedIsmlTag: isAttributeANestedIsmlTag,
            length         : trimmedAttribute.length,
            attrGlobalPos  : node.globalPos + attrLocalPos,
            valueGlobalPos : node.globalPos + valueLocalPos,
            fullValue      : trimmedAttribute,
            node
        };
    }
};

const getNodeIndentationSize = (node, isNodeHead) => {

    if (node.isContainer()) {
        return 0;
    }

    const content                    = isNodeHead ? node.value : node.suffixValue;
    const precedingEmptySpacesLength = content.search(/\S|$/);
    const fullPrecedingEmptySpaces   = content.substring(0, precedingEmptySpacesLength);
    const lineBreakLastPos           = Math.max(fullPrecedingEmptySpaces.lastIndexOf(Constants.EOL), 0);
    const precedingEmptySpaces       = content.substring(lineBreakLastPos, precedingEmptySpacesLength).replace(new RegExp(Constants.EOL, 'g'), '');
    const lastLineBreakPos           = Math.max(precedingEmptySpaces.lastIndexOf(Constants.EOL), 0);
    const indentationSize            = precedingEmptySpaces.substring(lastLineBreakPos).length;

    return Math.max(indentationSize, 0);
};

module.exports = IsmlNode;
