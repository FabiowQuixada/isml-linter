const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const IndentRule        = require('../tree/indent');
const ConfigUtils       = require('../../util/ConfigUtils');
const Constants         = require('../../Constants');
const GeneralUtils      = require('../../util/GeneralUtils');
const TreeBuilder       = require('../../isml_tree/TreeBuilder');

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

Rule.getFixedContent = rootNode => {
    addLineBreaks(rootNode);

    // Rebuilding the tree automatically updates all node data, such as column number,
    // line number, global position, etc;
    const stringifiedTree   = rootNode.toString();
    const newRootNode       = TreeBuilder.build(null, stringifiedTree).rootNode;
    const partialFixContent = IndentRule.getFixedContent(newRootNode);

    return GeneralUtils.applyActiveLineBreaks(partialFixContent);
};

const addLineBreaks = node => {
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        if ((child.isInSameLineAsParent() || child.isInSameLineAsPreviousSibling()) && !node.isIsmlComment()) {
            child.head = Constants.EOL + child.head;
        }

        if (child.endLineNumber === node.lineNumber && !node.isIsmlComment() && !node.tail.startsWith(Constants.EOL)) {
            node.tail = Constants.EOL + node.tail;
        }

        addLineBreaks(child);
    }
};

module.exports = Rule;
