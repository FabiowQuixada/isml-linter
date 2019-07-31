const IsmlNode = require('./IsmlNode');
/**
 * This is container node that holds values for multiclause tags, such as
 * an <isif> ... <iselseif> ... </isif> chain.
 *
 * It is not printed when the isml dom tree is printed;
 *
 * It is used ONLY to hold <isif>, <iselse>, <iselseif> nodes together;
 */

class MultiClauseNode extends IsmlNode {

    constructor() {
        super();
        this.value = '(Multiclause node)';
    }

    isMulticlause() { return true; }

    addChild(clause) {
        clause.depth         = this.depth;
        clause.parent        = this;
        this.newestChildNode = clause;
        this.children.push(clause);
    }

    print() {
        this.children.forEach( node => {
            node.print();
        });
    }
}

module.exports = MultiClauseNode;
