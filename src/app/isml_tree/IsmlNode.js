class IsmlNode {

    constructor() {
        this.value = '(root)';
        this.type = null;
        this.height = 0;
        this.innerText = null;
        this.children = [];
    }

    setValue(value) { this.value = value; }
    getValue() { return this.value; }

    getType() {

        let pos = this.value.indexOf('>');

        if (this.value.indexOf('/') !== -1) {
            pos = this.value.indexOf('/');
        }

        if (this.value.indexOf(' ') !== -1) {
            pos = this.value.indexOf(' ');
        }

        return this.value.substring(this.value.indexOf('<') + 1, pos);
    }

    getHeight() { return this.height; }
    setInnerText(text) { this.innerText = text; }
    getInnerText() { return this.innerText; }

    addChild(newNode) {
        newNode.height = this.height+1;
        this.children.push(newNode);
    }

    getChild(number) { return this.children[number]; }
    getNumberOfChildren() { return this.children.length; }

    isSelfClosing() { return this.value.endsWith('/>'); }
    isScriptNode() { return this.value === '<isscript>'; }

    print() {
        const indentSize = this.height*4;
        const singleIndentation = '    ';
        let indentation = '';

        for (let i = 0; i < indentSize; ++i) {
            indentation += ' ';
        }

        console.log(this.height + ' :: ' + indentation + this.value);

        if (this.isScriptNode()) {
            console.log(this.height+1 + ' :: ' + indentation + singleIndentation + '[script] ' + this.innerText);
        } else if (this.children.length > 0) {
            this.children.forEach( node => node.print() );
        } else if (this.innerText) {
            console.log(this.height+1 + ' ::' + indentation + singleIndentation + '[plain text] ' + this.innerText);
        }
    }
}

module.exports = IsmlNode;
