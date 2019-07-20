const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const Constants         = require('../../Constants');

const ruleName    = require('path').basename(__filename).slice(0, -3);
const description = 'A blank line at the end of the file is required';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleName, description);

Rule.isBroken = function(node) {
    return !(node.getSuffixValue() ?
        node.getSuffixValue().endsWith(Constants.EOL) :
        node.getValue().endsWith(Constants.EOL));
};

Rule.check = function(rootNode, result) {

    this.result = result || {
        occurrences : []
    };

    const node = rootNode.getLastChild();

    if (this.isBroken(node)) {
        const lineContent  = node.toString().substring(node.toString().lastIndexOf(Constants.EOL) + 1);
        const lineBreakQty = (node.toString().match(new RegExp(Constants.EOL, 'g')) || []).length;

        this.add(
            lineContent,
            node.getLineNumber() + lineBreakQty - 2,
            node.getGlobalPos() + node.toString().length - 1,
            1
        );
    }

    return this.result;
};

module.exports = Rule;
