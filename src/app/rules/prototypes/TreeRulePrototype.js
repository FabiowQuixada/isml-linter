const RulePrototype = require('./RulePrototype');

const TreeRulePrototype = Object.create(RulePrototype);

TreeRulePrototype.check = function(node, result) {

    this.result = result || {
        occurrences : []
    };

    node.children.forEach( child => this.check(child, this.result));

    if (this.isBroken(node)) {
        this.add(
            node.getValue().trim(),
            node.getLineNumber() - 1,
            node.getGlobalPos(),
            node.getValue().trim().length
        );
    }

    return this.result;
};

TreeRulePrototype.fix = function(stream = '') {

    if (!this.isRoot() && !this.isMulticlause()) {
        stream += this.value;
    }

    this.children.forEach( node =>
        stream = node.isBroken() ?
            node.toString(stream) :
            this.getFixedContent(node, stream)
    );

    if (!this.isRoot() && !this.isMulticlause()) {
        stream += this.suffix;
    }

    return stream;
};

module.exports = TreeRulePrototype;
