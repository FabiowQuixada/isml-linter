const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ConfigUtils       = require('../../util/ConfigUtils');
const ParseUtils        = require('../../isml_tree/ParseUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = '"require()" call is not allowed within a loop';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {

    if (node.value.indexOf('require(') === -1) {
        return false;
    }

    let iterator = node;

    while (iterator.parent) {
        iterator = iterator.parent;

        if (iterator.isOfType('isloop')) {
            return true;
        }
    }

    return false;
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
        const trimmedValue   = node.value.trim();
        const startPos       = trimmedValue.indexOf('require(');
        const beforeStartPos = trimmedValue.substring(0, startPos);
        const lineOffset     = ParseUtils.getLineBreakQty(beforeStartPos);
        const afterStartPos  = trimmedValue.substring(startPos);
        const length         = afterStartPos.indexOf(')') + 1;
        let globalPos        = node.globalPos + startPos;

        if (data.isCrlfLineBreak) {
            globalPos += lineOffset;
        }

        const error = this.add(
            node.value.trim(),
            node.lineNumber - 1,
            globalPos,
            length
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
