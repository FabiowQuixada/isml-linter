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

    addChild(newNode) {
        newNode.height = this.height+1;
        this.children.push(newNode);
    }

    getChild(number) { return this.children[number]; }
    getNumberOfChildren() { return this.children.length; }

    isSelfClosing() { return this.value.endsWith('/>'); }

    print() {
        const indentSize = this.height;
        let indentation = '';

        for (let i = 0; i < indentSize; ++i) {
            indentation += '    ';
        }

        console.log(this.height + ' :: ' + indentation + this.value);

        if (this.children.length > 0) {
            this.children.forEach( node => node.print() );
        }
    }
}

module.exports = IsmlNode;
