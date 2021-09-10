const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ConfigUtils       = require('../../util/ConfigUtils');
const ParseUtils        = require('../../isml_tree/ParseUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = '"require()" call is not allowed within a loop';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {

    if (node.head.indexOf('require(') === -1) {
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

Rule.check = function(node, data) {

    const config         = ConfigUtils.load();
    const occurrenceList = this.checkChildren(node, data);

    if (this.isBroken(node)) {
        const trimmedHead    = node.head.trim();
        const startPos       = trimmedHead.indexOf('require(');
        const beforeStartPos = trimmedHead.substring(0, startPos);
        const lineOffset     = ParseUtils.getLineBreakQty(beforeStartPos);
        const afterStartPos  = trimmedHead.substring(startPos);
        const length         = afterStartPos.indexOf(')') + 1;
        let globalPos        = node.globalPos + startPos;

        if (data.isCrlfLineBreak) {
            globalPos += lineOffset;
        }

        const error = this.getError(
            node.head.trim(),
            node.lineNumber + lineOffset,
            node.columnNumber + node.head.trim().indexOf('require('),
            globalPos,
            length
        );

        occurrenceList.push(error);
    }

    return this.return(node, occurrenceList, config);
};

module.exports = Rule;
