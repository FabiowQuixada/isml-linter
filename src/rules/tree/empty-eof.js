const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const Constants         = require('../../Constants');
const ParseUtils        = require('../../isml_tree/ParseUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'A blank line at the end of the file is required';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    const tempNode = node.isContainer() ? node.getLastChild() : node;

    return !(tempNode.suffixValue ?
        tempNode.suffixValue.endsWith(Constants.EOL) :
        tempNode.value.endsWith(Constants.EOL));
};

Rule.check = function(rootNode, data) {

    const occurrenceList = [];

    const node = rootNode.getLastChild();

    if (this.isBroken(node)) {
        const lineContent  = node.toString().substring(node.toString().lastIndexOf(Constants.EOL) + 1);
        const lineBreakQty = ParseUtils.getLineBreakQty(node.toString());
        const lineNumber   = node.lineNumber + lineBreakQty - 2;
        let globalPos      = node.globalPos;
        let length         = node.value.trim().length;

        if (node.suffixValue) {
            const lastLineBreakPos = node.suffixValue.lastIndexOf(Constants.EOL);
            const trailingSpaces   = node.suffixValue.substring(lastLineBreakPos + 1);

            if (trailingSpaces.length > 0) {
                globalPos = node.suffixGlobalPos + node.suffixValue.trim().length + 1;
                length    = trailingSpaces.length;

                if (data.isCrlfLineBreak) {
                    globalPos += ParseUtils.getLineBreakQty(node.suffixValue.trimStart());
                }
            } else {
                globalPos = node.suffixGlobalPos + 1;
                length    = node.suffixValue.trim().length;
            }
        }

        const error = this.getError(
            lineContent,
            lineNumber,
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
