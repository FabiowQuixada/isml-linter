const MAX_TEXT_DISPLAY_SIZE = 30;

class IsmlNode {

    constructor(value = '(root)', lineNumber = 0) {
        this.value      = value;
        this.lineNumber = lineNumber;
        this.type       = null;
        this.height     = 0;
        this.suffix     = '';
        this.type       = null;
        this.innerText  = null;
        this.parent     = null;
        this.children   = [];
    }

    setValue(value) { this.value = value; }
    getValue() { return this.value; }
    getLineNumber() { return this.lineNumber; }

    getType() {
        const regex = /<[a-zA-Z]*(\s|>|\/)/g;

        return this.value.match(regex)[0].slice(1, -1);
    }

    getHeight() { return this.height; }
    getParent() { return this.parent; }
    getGlobalPos() { return -1; }

    addChild(newNode) {
        newNode.height       = this.height+1;
        newNode.parent       = this;
        this.children.push(newNode);
        this.newestChildNode = newNode;
    }

    getChild(number) { return this.children[number]; }
    getLastChild() { return this.children[this.children.length - 1];}
    getNumberOfChildren() { return this.children.length; }

    isRoot() { return !this.parent; }
    isMulticlause() { return false; }

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

    isExpression() {
        const value = this.value.trim();

        return value.startsWith('${') &&
            value.endsWith('}');
    }

    isIsmlComment() {
        const value = this.value.trim();

        return value === '<iscomment>';
    }

    isHtmlComment() {
        const value = this.value.trim();

        return value.startsWith('<!--') &&
            value.endsWith('-->');
    }

    isCommentContent() {
        return this.parent && this.parent.isIsmlComment();
    }

    isSelfClosing() { return this.isHtmlComment() || this.isTag() && this.value.endsWith('/>'); }

    isOfType(type) {
        return !this.isRoot() && this.getType() === type;
    }

    print() {
        const indentSize = this.height;
        let indentation  = '';

        for (let i = 0; i < indentSize; ++i) {
            indentation += '    ';
        }

        console.log(this.height + ' :: ' + this.lineNumber + ' :: ' + indentation + this.getDisplayText());

        if (this.children.length > 0) {
            this.children.forEach( node => node.print() );
        }
    }

    getFullContent(stream = '') {
        if (!this.isRoot() && !this.isMulticlause()) {
            stream += this.value;
        }

        this.children.forEach( node => stream = node.getFullContent(stream) );

        if (!this.isRoot() && !this.isMulticlause()) {
            stream += this.suffix;
        }

        return stream;
    }

    // === Helper, "private" methods;

    getDisplayText() {
        let displayText = this.value;

        displayText = displayText
            .replace(/\n/g, '')
            .replace(/ +(?= )/g, '');

        if (this.value.length > MAX_TEXT_DISPLAY_SIZE - 3) {
            displayText = displayText.substring(0, MAX_TEXT_DISPLAY_SIZE - 3) + '...';
        }

        return displayText.trim();
    }
}

module.exports = IsmlNode;
