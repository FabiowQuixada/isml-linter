const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const Constants         = require('../../Constants');
const ParseUtils        = require('../../isml_tree/ParseUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'A blank line at the end of the file is required';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    const tempNode = node.isContainer() ? node.getLastChild() : node;

    return !(tempNode.tail ?
        tempNode.tail.endsWith(Constants.EOL) :
        tempNode.head.endsWith(Constants.EOL));
};

Rule.check = function(rootNode, data) {

    const occurrenceList = [];

    const node = rootNode.getLastChild();

    if (this.isBroken(node)) {
        const lineContent  = node.toString().substring(node.toString().lastIndexOf(Constants.EOL) + 1);
        const lineBreakQty = ParseUtils.getLineBreakQty(node.toString());
        const lineNumber   = node.isContainer() ? node.getLastChild().tailEndLineNumber : node.lineNumber + lineBreakQty - 1;
        let globalPos      = node.globalPos;
        let length         = node.head.trim().length;

        if (node.tail) {
            const lastLineBreakPos = node.tail.lastIndexOf(Constants.EOL);
            const trailingSpaces   = node.tail.substring(lastLineBreakPos + 1);

            if (trailingSpaces.length > 0) {
                globalPos = node.tailGlobalPos + node.tail.trim().length + 1;
                length    = trailingSpaces.length;

                if (data.isCrlfLineBreak) {
                    globalPos += ParseUtils.getLineBreakQty(node.tail.trimStart());
                }
            } else {
                globalPos = node.tailGlobalPos + 1;
                length    = node.tail.trim().length;
            }
        }

        const error = this.getError(
            lineContent,
            lineNumber,
            node.columnNumber,
            globalPos,
            length
        );

        occurrenceList.push(error);
    }

    return {
        occurrenceList
    };
};

module.exports = Rule;
