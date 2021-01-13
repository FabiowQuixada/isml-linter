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
    return !node.isEmpty() && node.depth > configMaxDepth;
};

Rule.check = function(node, data) {

    const result2 = {
        occurrences : []
    };

    const childrenResult = this.checkChildren(node, data);

    if (childrenResult) {
        result2.occurrences.push(...childrenResult.occurrences);
    }

    const config = this.getConfigs();

    if (this.isBroken(node)) {
        const stringifiedNode = node.toString().trim();
        let length            = stringifiedNode.length;

        if (data.isCrlfLineBreak) {
            length += ParseUtils.getLineBreakQty(stringifiedNode);
        }

        const error = this.add(
            stringifiedNode,
            node.lineNumber - 1,
            node.globalPos,
            length
        );

        result2.occurrences.push(error);
    }

    if (result2.occurrences.length &&
            config.autoFix &&
            this.getFixedContent &&
            node.isRoot()
    ) {
        result2.fixedContent = this.getFixedContent(node);
    }

    return result2;
};

module.exports = Rule;
