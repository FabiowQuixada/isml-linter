const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const Constants         = require('../../Constants');
const ParseUtils        = require('../../isml_tree/components/ParseUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'A blank line at the end of the file is required';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    const tempNode = node.isMulticlause() ? node.getLastChild() : node;

    return !(tempNode.suffixValue ?
        tempNode.suffixValue.endsWith(Constants.EOL) :
        tempNode.value.endsWith(Constants.EOL));
};

Rule.check = function(rootNode, result) {

    this.result = result || {
        occurrences : []
    };

    const node = rootNode.getLastChild();

    if (this.isBroken(node)) {
        const lineContent  = node.toString().substring(node.toString().lastIndexOf(Constants.EOL) + 1);
        const lineBreakQty = ParseUtils.getLineBreakQty(node.toString());

        this.add(
            lineContent,
            node.lineNumber + lineBreakQty - 2,
            node.globalPos + node.toString().length - 1,
            1
        );
    }

    return this.result;
};

module.exports = Rule;
