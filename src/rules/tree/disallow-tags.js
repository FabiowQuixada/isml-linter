const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ConfigUtils       = require('../../../src/util/ConfigUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Tag not allowed';

const Rule = Object.create(TreeRulePrototype);

const config            = ConfigUtils.load();
const disallowedTagList = config.rules['disallow-tags'] ?
    config.rules['disallow-tags'].values || [] :
    [];

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    return disallowedTagList.indexOf(node.getType()) >= 0;
};

Rule.check = function(node, result = { occurrences : [] }) {

    const config = ConfigUtils.load();
    this.result  = result || {
        occurrences : []
    };

    for (let i = 0; i < node.children.length; i++) {
        this.check(node.children[i], this.result);
    }

    if (this.isBroken(node)) {
        this.add(
            node.value.trim(),
            node.lineNumber - 1,
            node.globalPos,
            node.value.trim().length,
            `Tag "${node.getType()}" is not allowed.`
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

module.exports = Rule;
