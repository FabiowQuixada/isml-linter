const TreeRulePrototype = require('../prototypes/TreeRulePrototype');
const ConfigUtils       = require('../../util/ConfigUtils');
const ParseUtils        = require('../../isml_tree/ParseUtils');

const ruleId      = require('path').basename(__filename).slice(0, -3);
const description = '"require()" call is not allowed within a loop';

const Rule = Object.create(TreeRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(node) {

    if (node.value.indexOf('require(') === -1) {
        return false;
    }

    let iterator = node;

    while (iterator.parent) {
        iterator = iterator.parent;

        if (iterator.isOfType('isloop')) {
            return true;
        }
    }

    return false;
};

Rule.check = function(node, result = { occurrences : [] }) {

    const config = ConfigUtils.load();
    this.result  = result || {
        occurrences : []
    };

    for (let i = 0; i < node.children.length; i++) {
        this.check(node.children[i], this.result);
    }

    if (this.isBroken(node)) {
        const trimmedValue   = node.value.trim();
        const startPos       = trimmedValue.indexOf('require(');
        const beforeStartPos = trimmedValue.substring(0, startPos);
        const lineOffset     = ParseUtils.getLineBreakQty(beforeStartPos);
        const afterStartPos  = trimmedValue.substring(startPos);
        const length         = afterStartPos.indexOf(')') + 1;
        let globalPos        = node.globalPos + startPos;

        if (global.isWindows) {
            globalPos += lineOffset;
        }

        this.add(
            node.value.trim(),
            node.lineNumber - 1,
            globalPos,
            length
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

module.exports = Rule;
