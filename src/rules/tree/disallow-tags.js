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
    const occurrenceList = this.checkChildren(node, data);

    if (this.isBroken(node)) {
        const error = this.getError(
            node.head.trim(),
            node.lineNumber,
            node.columnNumber,
            node.globalPos,
            node.head.trim().length,
            `Tag "${node.getType()}" is not allowed.`
        );

        occurrenceList.push(error);
    }

    return this.return(node, occurrenceList, config);
};

module.exports = Rule;
