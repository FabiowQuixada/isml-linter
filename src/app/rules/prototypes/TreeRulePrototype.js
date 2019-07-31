const RulePrototype = require('./RulePrototype');
const ConfigUtils   = require('../../util/ConfigUtils');

const TreeRulePrototype = Object.create(RulePrototype);

TreeRulePrototype.check = function(node, result = { occurrences : [] }) {

    const config = ConfigUtils.load();
    this.result  = result || {
        occurrences : []
    };

    node.children.forEach( child => this.check(child, this.result));

    if (this.isBroken(node)) {
        this.add(
            node.value.trim(),
            node.lineNumber - 1,
            node.globalPos,
            node.value.trim().length
        );
    }

    if (this.result.occurrences.length &&
        config.autoFix &&
        this.getFixedContent &&
        node.isRoot()) {
        this.result.fixedContent = this.getFixedContent(node);
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
