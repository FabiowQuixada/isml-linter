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
        this.clauses = [];
        this.setValue('(Multiclause node)');
    }

    addClause(clause) {
        clause.height = this.height;
        this.clauses.push(clause);
    }

    getClause(number) { return this.clauses[number]; }
    getNumberOfClauses() { return this.clauses.length; }

    print() {
        this.clauses.forEach( node => {
            node.print();
        });
    }
}

module.exports = MultiClauseNode;
