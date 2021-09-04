const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ConfigUtils       = require('../../util/ConfigUtils');
const ParseUtils        = require('../../isml_tree/ParseUtils');

const ruleId                        = require('path').basename(__filename).slice(0, -3);
const disallowedOccurrenceContainer = [

    // dw.web.Resource;
    {
        key     : 'dw.web.Resource',
        wrong   : 'dw.web.',
        correct : 'Resource'
    },
    {
        key     : 'require(\'dw/web/Resource\')',
        wrong   : 'require(\'dw/web/Resource\')',
        correct : 'Resource'
    },
    {
        key     : 'require("dw/web/Resource")',
        wrong   : 'require("dw/web/Resource")',
        correct : 'Resource'
    },


    // dw.web.URLUtils;
    {
        key     : 'dw.web.URLUtils',
        wrong   : 'dw.web.',
        correct : 'URLUtils'
    },
    {
        key     : 'require(\'dw/web/URLUtils\')',
        wrong   : 'require(\'dw/web/URLUtils\')',
        correct : 'URLUtils'
    },
    {
        key     : 'require("dw/web/URLUtils")',
        wrong   : 'require("dw/web/URLUtils")',
        correct : 'URLUtils'
    },


    // dw.util.StringUtils;
    {
        key     : 'dw.util.StringUtils',
        wrong   : 'dw.util.',
        correct : 'StringUtils'
    },
    {
        key     : 'require(\'dw/util/StringUtils\')',
        wrong   : 'require(\'dw/util/StringUtils\')',
        correct : 'StringUtils'
    },
    {
        key     : 'require("dw/util/StringUtils")',
        wrong   : 'require("dw/util/StringUtils")',
        correct : 'StringUtils'
    }
];

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId);

Rule.isBroken = function (node) {
    for (let i = 0; i < disallowedOccurrenceContainer.length; i++) {
        const disallowedOccurrence = disallowedOccurrenceContainer[i];

        if (node.head.indexOf(disallowedOccurrence.key) >= 0) {
            return disallowedOccurrence;
        }
    }

    return null;
};

Rule.check = function(node, data) {

    const config               = ConfigUtils.load();
    const occurrenceList       = this.checkChildren(node, data);
    const disallowedOccurrence = this.isBroken(node);

    if (disallowedOccurrence) {
        const trimmedHead    = node.head.trim();
        const startPos       = trimmedHead.indexOf(disallowedOccurrence.key);
        const beforeStartPos = trimmedHead.substring(0, startPos);
        const lineOffset     = ParseUtils.getLineBreakQty(beforeStartPos);
        let globalPos        = node.globalPos + startPos;
        const message        = getMessage(disallowedOccurrence);

        if (data.isCrlfLineBreak) {
            globalPos += lineOffset;
        }

        const error = this.getError(
            node.head.trim(),
            node.lineNumber,
            node.columnNumber + node.head.trim().indexOf(disallowedOccurrence.key) - 1,
            globalPos,
            disallowedOccurrence.wrong.length,
            message
        );

        occurrenceList.push(error);
    }

    return this.return(node, occurrenceList, config);
};

Rule.getFixedContent = function(node) {

    for (let i = 0; i < disallowedOccurrenceContainer.length; i++) {
        const disallowedOccurrence = disallowedOccurrenceContainer[i];

        if (node.head.indexOf(disallowedOccurrence.key) >= 0) {
            node.head = node.head
                .split(disallowedOccurrence.key)
                .join(disallowedOccurrence.correct);
        }
    }

    for (let i = 0; i < node.children.length; i++) {
        this.getFixedContent(node.children[i]);
    }

    return node.toString();
};

const getMessage = disallowedOccurrence => {
    return `"${disallowedOccurrence.wrong}" is not necessary since "${disallowedOccurrence.correct}" is available globally`;
};

module.exports = Rule;
