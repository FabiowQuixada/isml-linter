const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
// const ConfigUtils       = require('../../util/ConfigUtils');
// const Constants         = require('../../Constants');
// const GeneralUtils = require('../../util/GeneralUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Only one element per line is allowed';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {
    return !node.isRoot() &&
        !node.isMulticlause() &&
        node.lineNumber === node.parent.lineNumber;
};

// Rule.getFixedContent = rootNode => {
//     fixContent(rootNode);

//     return GeneralUtils.applyActiveLinebreaks(rootNode.toString());
// };

// const fixContent = node => {
//     for (let i = 0; i < node.children.length; i++) {
//         const child = node.children[i];

//         if (child.isInSameLineAsParent() && !node.isIsmlComment()) {
//             const indentation       = getCorrectIndentation(child);
//             const parentIndentation = getCorrectIndentation(node);

//             child.value = `${Constants.EOL}${indentation}${child.value}${Constants.EOL}${parentIndentation}`;

//             if (child.suffixValue) {
//                 child.setSuffix(`${Constants.EOL}${indentation}${child.suffixValue}${Constants.EOL}`);
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
