const RulePrototype = require('./RulePrototype');

const TreeRulePrototype = Object.create(RulePrototype);

TreeRulePrototype.check = function(node, result) {

    const that  = this;
    this.result = result || {
        occurrences : []
    };

    node.children.forEach( child => this.check(child, this.result));

    if (this.isBroken(node)) {
        that.add(
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
            node.getFullContent(stream) :
            this.getFixedContent(node, stream)
    );

    if (!this.isRoot() && !this.isMulticlause()) {
        stream += this.suffix;
    }

    return stream;
};

module.exports = TreeRulePrototype;
