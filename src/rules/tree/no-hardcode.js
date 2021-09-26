const TreeRulePrototype = require('../prototypes/TreeRulePrototype');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = 'Hardcoded string is not allowed';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.getDefaultAttrs = () => {
    return {
        except            : [],
        allowHtmlEntities : true
    };
};

Rule.isBroken = function(node) {
    const ruleExceptionList  = this.getConfigs().except;
    const allowHtmlEntities  = this.getConfigs().allowHtmlEntities;
    const isTagContent       = isTagChild(node);
    const shouldCheckHead    = node.isOfType('text') && !node.isExpression() && !isTagContent;
    const isTextAnHtmlEntity = node.head.trim().startsWith('&') && node.head.trim().endsWith(';');
    let nodeHead             = node.head;

    if (!shouldCheckHead) {
        return false;
    }

    for (let i = 0; i < ruleExceptionList.length; i++) {
        const char = ruleExceptionList[i];

        nodeHead = nodeHead.split(char).join('');
    }

    if (allowHtmlEntities && isTextAnHtmlEntity) {
        return false;
    }

    return nodeHead.trim().length > 0;
};

const isTagChild = node => {
    const isCommentContent  = node.isDescendantOf('iscomment');
    const isIsscriptContent = node.isDescendantOf('isscript');
    const isScriptContent   = node.isDescendantOf('script');
    const isStyleContent    = node.isDescendantOf('style');

    return isCommentContent || isIsscriptContent || isScriptContent || isStyleContent;
};

module.exports = Rule;
