const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ParseUtils        = require('../../isml_tree/ParseUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'max depth beyond allowed';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.getDefaultAttrs = () => {
    return {
        value : 10
    };
};

Rule.isBroken = function(node) {
    const configMaxDepth = this.getConfigs().value;
    return !node.isContainer() && !node.isEmpty() && node.depth > configMaxDepth;
};

Rule.check = function(node, data) {

    const config         = this.getConfigs();
    const occurrenceList = [];

    if (this.isBroken(node)) {
        const stringifiedNode = node.toString().trim();
        let length            = stringifiedNode.length;

        if (data.isCrlfLineBreak) {
            length += ParseUtils.getLineBreakQty(stringifiedNode);
        }

        const error = this.getError(
            stringifiedNode,
            node.lineNumber,
            node.columnNumber,
            node.globalPos,
            length
        );

        occurrenceList.push(error);
    } else {
        for (let i = 0; i < node.children.length; i++) {
            const childrenResult = this.check(node.children[i], data);
            occurrenceList.push(...childrenResult);
        }
    }

    return this.return(node, occurrenceList, config);
};

module.exports = Rule;
