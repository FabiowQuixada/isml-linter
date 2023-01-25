const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'This is a void element, and as such, should not have a corresponding closing tag';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    return node.isVoidElement() && node.tail.length > 0;
};

Rule.check = function(node, data) {

    const ruleConfig   = this.getConfigs();
    let occurrenceList = [];

    occurrenceList = this.checkChildren(node, data);

    if (this.isBroken(node)) {
        const error = this.getError(
            node.tail.trim(),
            node.tailLineNumber,
            node.tailColumnNumber,
            node.tailGlobalPos,
            node.tail.trim().length,
            `"<${node.getType()}>" is a void element, and as such, should not have a corresponding closing tag`
        );

        occurrenceList.push(error);
    }

    return this.return(node, occurrenceList, ruleConfig);
};

Rule.getFixedContent = node => {

    if (node.isVoidElement()) {
        node.setTail('', null, null, null);
    }

    return node.toString();
};

module.exports = Rule;
