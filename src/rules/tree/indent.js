const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
// const ParseUtils        = require('../../isml_tree/components/ParseUtils');
// const Constants         = require('../../Constants');
// const GeneralUtils      = require('../../util/GeneralUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Line incorrectly indented';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.getDefaultAttrs = () => {
    return {
        size : 4
    };
};

Rule.getIndentation = function(depth = 1) {
    const indentationSize = this.getConfigs().size * depth;
    let indentation       = '';

    for (let i = 0; i < indentationSize; ++i) {
        indentation += ' ';
    }

    return indentation;
};

Rule.isBroken = function(node) {

    const configIndentSize    = this.getConfigs().size;
    const expectedIndentation = (node.depth - 1) * configIndentSize;
    const actualIndentation   = node.getIndentationSize();

    return !node.isRoot() &&
        !node.isEmpty() &&
        !node.isInSameLineAsParent() &&
        expectedIndentation !== actualIndentation;
};

Rule.check = function(node, result) {

    this.result = result || {
        occurrences : []
    };

    for (let i = 0; i < node.children.length; i++) {
        this.check(node.children[i], this.result);
    }

    const config    = this.getConfigs();
    const globalPos = node.globalPos - node.getIndentationSize();

    if (this.isBroken(node)) {
        this.add(
            node.value.trim(),
            node.lineNumber - 1,
            globalPos,
            node.getIndentationSize(),
            description
        );
    }

    if (this.result.occurrences.length &&
        config.autoFix &&
        this.getFixedContent &&
        node.isRoot()) {
        this.result.fixedContent = this.getFixedContent(node);
    }

    return this.result;
};

// Rule.getFixedContent = function(node, stream = '') {
//     const indentation = this.getIndentation(node.depth - 1);
//     stream            = addValue(node, stream, indentation);
//     node.children.forEach( node => stream = this.getFixedContent(node, stream) );
//     stream            = addSuffix(node, stream, indentation);

//     return GeneralUtils.applyActiveLinebreaks(stream);
// };

// const addValue = (node, stream, indentation) => {
//     const preLineBreakContent = ParseUtils.getPreLineBreakContent(node);
//     let localStream           = stream;

//     if (!node.isRoot() && !node.isMulticlause() && node.value.trim()) {
//         localStream += (node.isInSameLineAsParent() ? '' : preLineBreakContent + indentation) +
//             node.value.trim();

//         const trailingBlankContent = ParseUtils.getTrailingBlankContent(node);
//         const lineBreakQty         = ParseUtils.getLineBreakQty(trailingBlankContent);

//         for (let i = 0; i < lineBreakQty; i++) {
//             localStream += Constants.EOL;
//         }
//     }

//     return localStream;
// };

// const addSuffix = (node, stream, indentation) => {
//     const suffixValue             = node.suffixValue;
//     const leadingContent          = suffixValue.substring(0, ParseUtils.getNextNonEmptyCharPos(suffixValue));
//     const contentAboveCurrentLine = leadingContent.substring(0, leadingContent.lastIndexOf(Constants.EOL) + 1);
//     const trailingContent         = ParseUtils.getSuffixTrailingBlankContent(node);
//     const trimmedTrailingContent  = trailingContent.substring(0, trailingContent.lastIndexOf(Constants.EOL) + 1);
//     let localStream               = stream;

//     if (suffixValue) {
//         localStream +=
//             (node.getLastChild() && node.getLastChild().isInSameLineAsParent() ? '' : contentAboveCurrentLine + indentation) +
//             suffixValue.trim() +
//             (node.isLastChild() ? trimmedTrailingContent : trailingContent) ;
//     } else if (!node.isRoot() && !node.isMulticlause() && node.parent.isRoot()) {
//         localStream += node.value;
//     }

//     return localStream;
// };

module.exports = Rule;
