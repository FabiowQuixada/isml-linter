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

Rule.check = function(node, result) {

    this.result = result || {
        occurrences : []
    };

    for (let i = 0; i < node.children.length; i++) {
        this.check(node.children[i], this.result);
    }

    const config = this.getConfigs();

    if (this.isBroken(node)) {
        const stringifiedNode = node.toString().trim();
        let length            = stringifiedNode.length;

        if (global.isWindows) {
            length += ParseUtils.getLineBreakQty(stringifiedNode);
        }

        this.add(
            stringifiedNode,
            node.lineNumber - 1,
            node.globalPos,
            length
        );
    }

    if (this.result.occurrences.length &&
            config.autoFix &&
            this.getFixedContent &&
            node.isRoot()
    ) {
        this.result.fixedContent = this.getFixedContent(node);
    }

    return this.result;
};

module.exports = Rule;
