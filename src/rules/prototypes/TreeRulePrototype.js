const RulePrototype = require('./RulePrototype');
const ConfigUtils   = require('../../util/ConfigUtils');
const ParseUtils    = require('../../isml_tree/ParseUtils');

const TreeRulePrototype = Object.create(RulePrototype);

TreeRulePrototype.check = function(node, data) {

    const config      = ConfigUtils.load();
    const occurrences = this.checkChildren(node, data);

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

        occurrences.push(error);
    }

    return this.return(node, occurrences, config);
};

TreeRulePrototype.shouldGetFixedContent = function(node, occurrences, config) {
    return occurrences.length &&
    config.autoFix &&
    this.getFixedContent &&
    node.isRoot();
};

TreeRulePrototype.return = function(node, occurrences, config) {
    if (this.shouldGetFixedContent(node, occurrences, config)) {
        return {
            occurrences,
            fixedContent : this.getFixedContent(node)
        };
    } else if (node.isRoot()) {
        return  {
            occurrences
        } ;

    } else {
        return occurrences;
    }
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
