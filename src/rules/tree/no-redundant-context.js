const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ConfigUtils       = require('../../util/ConfigUtils');
const ParseUtils        = require('../../isml_tree/ParseUtils');

const ruleId                         = require('path').basename(__filename).slice(0, -3);
const disallowedStringsDataContainer = [

    // dw.web.Resource;
    {
        key   : 'dw.web.Resource',
        part1 : 'dw.web.',
        part2 : 'Resource'
    },
    {
        key   : 'require(\'dw/web/Resource\')',
        part1 : 'require(\'dw/web/Resource\')',
        part2 : 'Resource'
    },
    {
        key   : 'require("dw/web/Resource")',
        part1 : 'require("dw/web/Resource")',
        part2 : 'Resource'
    },


    // dw.web.URLUtils;
    {
        key   : 'dw.web.URLUtils',
        part1 : 'dw.web.',
        part2 : 'URLUtils'
    },
    {
        key   : 'require(\'dw/web/URLUtils\')',
        part1 : 'require(\'dw/web/URLUtils\')',
        part2 : 'URLUtils'
    },
    {
        key   : 'require("dw/web/URLUtils")',
        part1 : 'require("dw/web/URLUtils")',
        part2 : 'URLUtils'
    },


    // dw.util.StringUtils;
    {
        key   : 'dw.util.StringUtils',
        part1 : 'dw.util.',
        part2 : 'StringUtils'
    },
    {
        key   : 'require(\'dw/util/StringUtils\')',
        part1 : 'require(\'dw/util/StringUtils\')',
        part2 : 'StringUtils'
    },
    {
        key   : 'require("dw/util/StringUtils")',
        part1 : 'require("dw/util/StringUtils")',
        part2 : 'StringUtils'
    }
];

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId);

Rule.isBroken = function (node) {
    for (let i = 0; i < disallowedStringsDataContainer.length; i++) {
        const disallowedStringData = disallowedStringsDataContainer[i];

        if (node.value.indexOf(disallowedStringData.key) >= 0) {
            return disallowedStringData;
        }
    }

    return null;
};

Rule.check = function(node, data) {

    const config               = ConfigUtils.load();
    const occurrenceList       = this.checkChildren(node, data);
    const disallowedStringData = this.isBroken(node);

    if (disallowedStringData) {
        const trimmedValue   = node.value.trim();
        const startPos       = trimmedValue.indexOf(disallowedStringData.key);
        const beforeStartPos = trimmedValue.substring(0, startPos);
        const lineOffset     = ParseUtils.getLineBreakQty(beforeStartPos);
        let globalPos        = node.globalPos + startPos;
        const message        = getMessage(disallowedStringData);

        if (data.isCrlfLineBreak) {
            globalPos += lineOffset;
        }

        const error = this.getError(
            node.value.trim(),
            node.lineNumber,
            node.columnNumber + node.value.trim().indexOf(disallowedStringData.key) - 1,
            globalPos,
            disallowedStringData.part1.length,
            message
        );

        occurrenceList.push(error);
    }

    return this.return(node, occurrenceList, config);
};

Rule.getFixedContent = function(node) {

    for (let i = 0; i < disallowedStringsDataContainer.length; i++) {
        const disallowedOccurrence = disallowedStringsDataContainer[i];

        if (node.value.indexOf(disallowedOccurrence.key) >= 0) {
            node.value = node.value
                .split(disallowedOccurrence.key)
                .join(disallowedOccurrence.part2);
        }
    }

    for (let i = 0; i < node.children.length; i++) {
        this.getFixedContent(node.children[i]);
    }

    return node.toString();
};

const getMessage = disallowedString => {
    return `"${disallowedString.part1}" is not necessary since "${disallowedString.part2}" is available globally`;
};

module.exports = Rule;
