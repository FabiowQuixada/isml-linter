const IsmlNode = require('./IsmlNode');

/**
 * This is container node that holds values for multi-clause tags, such as
 * an <isif> ... <iselseif> ... </isif> chain.
 *
 * It is not printed when the isml dom tree is printed;
 *
 * It is used ONLY to hold <isif>, <iselse>, <iselseif> nodes together;
 */

class ContainerNode extends IsmlNode {

    constructor(lineNumber, globalPos) {
        super();
        this.head       = '(Container node)';
        this.lineNumber = lineNumber;
        this.globalPos  = globalPos;
    }

    isContainer() { return true; }

    addChild(clause) {
        clause.depth         = this.depth;
        clause.parent        = this;
        clause.childNo       = this.children.length;
        this.newestChildNode = clause;
        this.children.push(clause);
    }

    print() {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].print();
        }
    }
}

module.exports = ContainerNode;
