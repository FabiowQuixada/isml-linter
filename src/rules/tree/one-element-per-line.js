const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const IndentRule        = require('../tree/indent');
const ConfigUtils       = require('../../util/ConfigUtils');
const Constants         = require('../../Constants');
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
        node.lineNumber === node.parent.endLineNumber;
};

Rule.getFixedContent = rootNode => {
    addLineBreaks(rootNode);

    // Rebuilding the tree automatically updates all node data, such as column number,
    // line number, global position, etc;
    const stringifiedTree   = rootNode.toString();
    const newRootNode       = TreeBuilder.build(null, stringifiedTree).rootNode;
    const partialFixContent = IndentRule.getFixedContent(newRootNode);

    return partialFixContent;
};

const addLineBreaks = node => {
    const config              = ConfigUtils.load();
    const ruleConfig          = config.rules[ruleId];
    const shouldIgnoreNonTags = ruleConfig && ruleConfig.except && ruleConfig.except.indexOf('non-tag') >= 0;

    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        if (shouldAddLeadingLineBreakToChildHead(node, child, shouldIgnoreNonTags)) {
            child.head = Constants.EOL + child.head;
        }

        if (shouldAddLeadingLineBreakToParentTail(node, child, shouldIgnoreNonTags)) {
            node.tail = Constants.EOL + node.tail;
        }

        addLineBreaks(child);
    }
};

const shouldAddLeadingLineBreakToChildHead = (node, child, shouldIgnoreNonTags) => {
    return (child.isFirstChild() && child.isInSameLineAsParentEnd() || child.isTag() && child.isInSameLineAsPreviousSibling())
        && !node.isIsmlComment()
        && (child.isTag() || !child.isTag() && !shouldIgnoreNonTags);
};

const shouldAddLeadingLineBreakToParentTail = (node, child, shouldIgnoreNonTags) => {
    return child.isLastChild()
        && child.endLineNumber === node.tailLineNumber
        && !node.isIsmlComment()
        && !node.tail.startsWith(Constants.EOL)
        && (child.isTag() || !child.isTag() && !shouldIgnoreNonTags);
};

module.exports = Rule;
