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

Rule.check = function(node, result = { occurrences : [] }, data) {

    const config  = ConfigUtils.load();
    const result2 = {
        occurrences : []
    };

    const childrenResult = this.checkChildren(node, result2, data);

    if (childrenResult) {
        result2.occurrences.push(...childrenResult.occurrences);
    }

    if (this.isBroken(node)) {
        const error = this.add(
            node.value.trim(),
            node.lineNumber - 1,
            node.globalPos,
            node.value.trim().length,
            `Tag "${node.getType()}" is not allowed.`
        );

        result2.occurrences.push(error);
    }

    if (result2.occurrences.length &&
        config.autoFix &&
        this.getFixedContent &&
        node.isRoot()) {
        result2.fixedContent = this.getFixedContent(node);
    }

    return result2;
};

module.exports = Rule;
