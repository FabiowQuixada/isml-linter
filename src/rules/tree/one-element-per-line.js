const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ConfigUtils       = require('../../util/ConfigUtils');
// const Constants         = require('../../Constants');
// const GeneralUtils = require('../../util/GeneralUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Only one element per line is allowed';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {

    const config     = ConfigUtils.load();
    const ruleConfig = config.rules[ruleId];

    if (ruleConfig && ruleConfig.except) {

        if (node.parent && node.parent.isOfType('iscomment') && ruleConfig.except.indexOf('iscomment') >= 0) {
            return false;
        }

        if (!node.isIsmlTag() && !node.isHtmlTag() && ruleConfig.except.indexOf('non-tag') >= 0) {
            return false;
        }
    }

    return !node.isRoot() &&
        !node.parent.isContainer() &&
        node.lineNumber === node.parent.lineNumber;
};

// Rule.getFixedContent = rootNode => {
//     fixContent(rootNode);

//     return GeneralUtils.applyActiveLineBreaks(rootNode.toString());
// };

// const fixContent = node => {
//     for (let i = 0; i < node.children.length; i++) {
//         const child = node.children[i];

//         if (child.isInSameLineAsParent() && !node.isIsmlComment()) {
//             const indentation       = getCorrectIndentation(child);
//             const parentIndentation = getCorrectIndentation(node);

//             child.head = `${Constants.EOL}${indentation}${child.head}${Constants.EOL}${parentIndentation}`;

//             if (child.tailValue) {
//                 child.setSuffix(`${Constants.EOL}${indentation}${child.tailValue}${Constants.EOL}`);
//             }
//         }

//         fixContent(child);
//     }
// };

// const getCorrectIndentation = node => {
//     const indentSize = node.depth - 1;
//     const config     = ConfigUtils.load();
//     let indentation  = '';
//     let indentUnit   = '';

//     for (let i = 0; i < (config.indent || 4); ++i) {
//         indentUnit += ' ';
//     }

//     for (let i = 0; i < indentSize; ++i) {
//         indentation += indentUnit;
//     }

//     return indentation;
// };

module.exports = Rule;
