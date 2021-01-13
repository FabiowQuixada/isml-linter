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

Rule.check = function(node, data) {

    const config      = ConfigUtils.load();
    const occurrences = [];

    const childrenOccurrences = this.checkChildren(node, data);

    if (childrenOccurrences) {
        occurrences.push(...childrenOccurrences);
    }

    if (this.isBroken(node)) {
        const error = this.add(
            node.value.trim(),
            node.lineNumber - 1,
            node.globalPos,
            node.value.trim().length,
            `Tag "${node.getType()}" is not allowed.`
        );

        occurrences.push(error);
    }

    if (this.shouldGetFixedContent(node, occurrences, config)) {
        return {
            occurrences,
            fixedContent : this.getFixedContent(node)
        };
    }

    return node.isRoot() ?
        { occurrences } :
        occurrences;
};

module.exports = Rule;
