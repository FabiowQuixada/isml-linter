const RulePrototype = require('./RulePrototype');
const ConfigUtils   = require('../../util/ConfigUtils');
const ParseUtils    = require('../../isml_tree/ParseUtils');

const TreeRulePrototype = Object.create(RulePrototype);

TreeRulePrototype.check = function(node, data) {

    const config         = ConfigUtils.load();
    const occurrenceList = this.checkChildren(node, data);

    if (this.isBroken(node)) {
        let length = node.head.trim().length;

        if (data.isCrlfLineBreak) {
            length += ParseUtils.getLineBreakQty(node.head.trim());
        }

        const error = this.getError(
            node.head.trim(),
            node.lineNumber,
            node.columnNumber,
            node.globalPos,
            length
        );

        occurrenceList.push(error);
    }

    return this.return(node, occurrenceList, config);
};

TreeRulePrototype.shouldGetFixedContent = function(node, occurrenceList, config) {
    return occurrenceList.length &&
    config.autoFix &&
    this.getFixedContent &&
    node.isRoot();
};

TreeRulePrototype.return = function(node, occurrenceList, config) {
    if (this.shouldGetFixedContent(node, occurrenceList, config)) {
        return {
            occurrenceList,
            fixedContent : this.getFixedContent(node)
        };
    } else if (node.isRoot()) {
        occurrenceList.sort((occurrence1, occurrence2) => {
            if ( occurrence1.lineNumber < occurrence2.lineNumber ) {
                return -1;
            }

            if ( occurrence1.lineNumber > occurrence2.lineNumber ) {
                return 1;
            }

            return 0;
        });

        return  {
            occurrenceList
        };

    } else {
        return occurrenceList;
    }
};

module.exports = TreeRulePrototype;
