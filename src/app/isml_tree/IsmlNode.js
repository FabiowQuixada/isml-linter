const MAX_TEXT_DISPLAY_SIZE = 30;

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
        const regex = /<[a-zA-Z]*(\s|>|\/)/g;

        return this.value.match(regex)[0].slice(1, -1);
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

        console.log(this.height + ' :: ' + indentation + this.getDisplayText());

        if (this.children.length > 0) {
            this.children.forEach( node => node.print() );
        }
    }

    // === Helper, "private" methods;

    getDisplayText() {
        let displayText = this.value;

        if (this.value.length > MAX_TEXT_DISPLAY_SIZE - 3) {
            displayText = this.value.substring(0, MAX_TEXT_DISPLAY_SIZE - 3) + '...';
        }

        return displayText.trim();
    }
}

module.exports = IsmlNode;
