const IsmlNode = require('./IsmlNode');
/**
 * This is a helper node that holds values for multiclause tags, such as
 * an <isif> ... <iselseif> ... </isif> chain.
 *
 * It is not printed when the isml dom tree is printed;
 */

class MultiClauseNode extends IsmlNode {

    constructor() {
        super();
        this.setValue('(Multiclause node)');
    }

    addChild(clause) {
        clause.height = this.height;
        this.children.push(clause);
    }

    print() {
        this.children.forEach( node => {
            node.print();
        });
    }
}

module.exports = MultiClauseNode;
