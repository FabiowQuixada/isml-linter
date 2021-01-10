const RulePrototype = require('./RulePrototype');
const ConfigUtils   = require('../../util/ConfigUtils');
const ParseUtils    = require('../../isml_tree/ParseUtils');

const TreeRulePrototype = Object.create(RulePrototype);

TreeRulePrototype.check = function(node, result = { occurrences : [] }) {

    const config = ConfigUtils.load();
    this.result  = result || {
        occurrences : []
    };

    for (let i = 0; i < node.children.length; i++) {
        this.check(node.children[i], this.result);
    }

    if (this.isBroken(node)) {
        let length = node.value.trim().length;

        if (global.isWindows) {
            length += ParseUtils.getLineBreakQty(node.value.trim());
        }

        this.add(
            node.value.trim(),
            node.lineNumber - 1,
            node.globalPos,
            length
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

    if (!this.isRoot() && !this.isContainer()) {
        stream += this.value;
    }

    for (let i = 0; i < this.children.length; i++) {
        const node = this.children[i];
        stream     = node.isBroken() ?
            node.toString(stream) :
            this.getFixedContent(node, stream);
    }

    if (!this.isRoot() && !this.isContainer()) {
        stream += this.suffix;
    }

    return stream;
};

module.exports = TreeRulePrototype;
