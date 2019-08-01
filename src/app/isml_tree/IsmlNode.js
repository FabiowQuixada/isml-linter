const MAX_TEXT_DISPLAY_SIZE = 30;

const ConfigUtils = require('../util/ConfigUtils');
const Constants   = require('../Constants');
const SfccTags    = require('../enums/SfccTags');

let ID_COUNTER = 0;

class IsmlNode {

    /**
     * @param {String} value      node opening tag value, including attributes
     * @param {Number} lineNumber node starting line number
     * @param {Number} globalPos  node starting position since the beginning of the file
     */
    constructor(value = '(root)', lineNumber = 0, globalPos) {
        this.id               = ID_COUNTER++;
        this.value            = value;      // '<div class="my_class">'
        this.lineNumber       = lineNumber; // 7
        this.globalPos        = globalPos;  // 184
        this.depth            = 0;          // Isml dom tree node depth
        this.suffixValue      = '';         // '</div>'
        this.suffixLineNumber = -1;         // 9
        this.suffixGlobalPos  = -1;         // 207
        this.parent           = null;       // Parent isml node;
        this.children         = [];         // Child isml nodes;
    }

    // Suffix is the element corresponding closing tag, such as </div>
    setSuffix(value, lineNumber, globalPos) {
        this.suffixValue      = value;
        this.suffixLineNumber = lineNumber;
        this.suffixGlobalPos  = globalPos;
    }

    // Returns a string. Examples: 'div', 'isprint', 'doctype';
    getType() {
        const value = this.value.trim();

        if (value.startsWith('<!--')) {
            return 'html_comment';
        } else if (this.isDocType()) {
            return 'doctype';
        } else if (this.isDynamicElement()) {
            return 'dynamic_element';
        } else if (this.isMulticlause()) {
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

    isDocType() {
        return this.value.toLowerCase().trim().startsWith('<!doctype ');
    }

    // Checks if the node type is dynamically set, such in:
    // <${aPdictVariable} />
    isDynamicElement() {
        return this.value.trim().startsWith('<${');
    }

    isInSameLineAsParent() {
        return this.parent && this.parent.lineNumber === this.lineNumber;
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
        if (!this.isHtmlTag() && !this.isIsmlTag()) {
            return [];
        }

        return parseAttributes(this);
    }

    getAttr(name) {
        return this.getAttributeList().find( attr => attr.label === name );
    }

    addChild(newNode) {
        newNode.depth        = this.depth + 1;
        newNode.parent       = this;
        this.children.push(newNode);
        this.newestChildNode = newNode;
    }

    getLastChild()        { return this.children[this.children.length - 1]; }
    getNumberOfChildren() { return this.children.length;                    }

    getIndentationSize() {
        const precedingEmptySpacesLength = this.value.search(/\S|$/);
        const precedingEmptySpaces       = this.value.substring(0, precedingEmptySpacesLength);
        const lastLineBreakPos           = precedingEmptySpaces.lastIndexOf(Constants.EOL);
        const indentationSize            = precedingEmptySpaces.substring(lastLineBreakPos).length;

        return Math.max(indentationSize - 1, 0);
    }

    isRoot() { return !this.parent; }

    // Always returns false. It is true only for the container elements, please check MultiClauseNode class;
    isMulticlause() { return false; }

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

    isCustomIsmlTag() {
        return this.isIsmlTag() && !SfccTags[this.getType()];
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

    isCommentContent() {
        return this.parent && this.parent.isIsmlComment();
    }

    // Checks if node is HTML 5 void element;
    isVoidElement() {
        const config = ConfigUtils.load();

        return !config.disableHtml5 && Constants.voidElementsArray.indexOf(this.getType()) !== -1;
    }

    // For <div />    , returns true;
    // For <div></div>, returns false;
    isSelfClosing() {
        return !this.isMulticlause() && (
            this.isDocType() ||
            this.isVoidElement() ||
            this.isHtmlComment() ||
            this.isTag() && this.value.endsWith('/>'));
    }

    isOfType(type) {
        return typeof type === 'string' ?
            !this.isRoot() && this.getType() === type :
            type.some( elem => elem === this.getType());
    }

    isEmpty() {
        return !this.value.trim();
    }

    isLastChild()  {
        return !this.parent || this.parent.getLastChild() === this;
    }

    removeChild(node) {
        const index       = this.children.map( child => child.id ).indexOf(node.id);
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

        if (!this.isMulticlause() && this.isEmpty() && !this.isLastChild()) {
            return stream;
        }

        if (!this.isRoot() && !this.isMulticlause()) {
            stream += this.value;
        }

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            stream      = child.toString(stream);
        }

        if (!this.isRoot() && !this.isMulticlause()) {
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

// Gets array of element attributes;
const parseAttributes = node => {
    const trimmedValue     = node.value.trim();
    const nodeValue        = trimmedValue.substring(1, trimmedValue.length - 1);
    const rawAttrNodeValue = nodeValue.split(' ').slice(1).join(' ');
    let outsideQuotes      = true;

    const maskedContent = rawAttrNodeValue.split('').map( (char, i) => {

        if (i > 2 && rawAttrNodeValue[i - 2] === '=' && rawAttrNodeValue[i - 1] === '"') {
            outsideQuotes = false;
        }

        if (i > 2 && rawAttrNodeValue[i - 1] !== '=' && char === '"') {
            outsideQuotes = true;
        }

        return outsideQuotes ? char : '_';
    }).join('');

    const blankSpaceIndexesArray = maskedContent
        .split('')
        .map((e, i) => e === ' ' ? i : '')
        .filter(String);

    const stringifiedAttributesArray = [];

    for (let i = 0; i < blankSpaceIndexesArray.length; i++) {
        const spacePosition = blankSpaceIndexesArray[i];

        stringifiedAttributesArray.push(i === 0 ?
            rawAttrNodeValue.substring(0, spacePosition) :
            rawAttrNodeValue.substring(blankSpaceIndexesArray[i - 1], spacePosition));
    }

    const lastAttribute = rawAttrNodeValue.substring(blankSpaceIndexesArray[blankSpaceIndexesArray.length - 1] + 1, rawAttrNodeValue.length);
    if (lastAttribute && lastAttribute !== '/') {
        stringifiedAttributesArray.push(lastAttribute);
    }

    const attributesArray = stringifiedAttributesArray.map( attr => {
        const attributeProps = attr.split('=');
        const label          = attributeProps[0].trim();
        const value          = attributeProps[1] ? attributeProps[1].substring(1, attributeProps[1].length - 1) : null;
        const values         = value ? value.split(' ') : null;

        const attrLocalPos  = node.value.trim().indexOf(attr);
        const valueLocalPos = attr.indexOf(value);

        return {
            name           : label,
            value          : value,
            values         : values,
            attrGlobalPos  : node.globalPos + attrLocalPos,
            nameLength     : label.length,
            valueGlobalPos : node.globalPos + valueLocalPos,
            valueLength    : value ? value.length : 0,
            attrFullValue  : attr,
            attrFullLength : attr.length,
            node           : node
        };
    });

    return attributesArray;
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

module.exports = IsmlNode;
