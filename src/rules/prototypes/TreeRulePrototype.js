const RulePrototype = require('./RulePrototype');
const ConfigUtils   = require('../../util/ConfigUtils');
const ParseUtils    = require('../../isml_tree/ParseUtils');

const TreeRulePrototype = Object.create(RulePrototype);

TreeRulePrototype.check = function(node, data) {

    const config         = ConfigUtils.load();
    const occurrenceList = this.checkChildren(node, data);

    if (this.isBroken(node)) {
        let length = node.value.trim().length;

        if (data.isCrlfLineBreak) {
            length += ParseUtils.getLineBreakQty(node.value.trim());
        }

        const error = this.getError(
            node.value.trim(),
            node.lineNumber - 1,
            node.globalPos,
            length
        );

        occurrenceList.push(error);
    }

    return this.return(node, occurrenceList, config);
};

TreeRulePrototype.shouldGetFixedContent = function(node, occurrenceList, config) {
    return occurrenceList.length &&
    config.autoFix &&
    this.getFixedContent &&
    node.isRoot();
};

TreeRulePrototype.return = function(node, occurrenceList, config) {
    if (this.shouldGetFixedContent(node, occurrenceList, config)) {
        return {
            occurrenceList,
            fixedContent : this.getFixedContent(node)
        };
    } else if (node.isRoot()) {
        return  {
            occurrenceList
        } ;

    } else {
        return occurrenceList;
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
