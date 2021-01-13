const RulePrototype = require('./RulePrototype');
const ConfigUtils   = require('../../util/ConfigUtils');
const ParseUtils    = require('../../isml_tree/ParseUtils');

const TreeRulePrototype = Object.create(RulePrototype);

TreeRulePrototype.check = function(node, result = { occurrences : [] }, data) {

    const config  = ConfigUtils.load();
    const result2 = {
        occurrences : []
    };

    const childrenResult = this.checkChildren(node, result, data);

    if (childrenResult) {
        result2.occurrences.push(...childrenResult.occurrences);
    }

    if (this.isBroken(node)) {
        let length = node.value.trim().length;

        if (data.isCrlfLineBreak) {
            length += ParseUtils.getLineBreakQty(node.value.trim());
        }

        const error = this.add(
            node.value.trim(),
            node.lineNumber - 1,
            node.globalPos,
            length
        );

        result2.occurrences.push(error);
    }

    if (result.occurrences.length &&
        config.autoFix &&
        this.getFixedContent &&
        node.isRoot()) {
        result.fixedContent = this.getFixedContent(node);
    }

    return result2;
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
