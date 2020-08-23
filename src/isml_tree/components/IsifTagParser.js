const IsmlNode     = require('../IsmlNode');
const TreeBuilder  = require('../TreeBuilder');
const ParseUtils   = require('./ParseUtils');
const GeneralUtils = require('../../util/GeneralUtils');

const run = (content, state) => {

    const multiClauseNode = state.parentNode.newestChildNode;
    const clauseList      = ParseUtils.getClauseList(content);
    let lineNumber        = 0;

    for (let index = 0; index < clauseList.length; index++) {
        const clauseContent = clauseList[index];
        index === 0 ?
            parseMainClause(multiClauseNode, clauseContent, state) :
            parseElseClause(multiClauseNode, clauseContent, state);

        lineNumber                              = ParseUtils.getLineBreakQty(clauseContent);
        state.currentLineNumber                 += lineNumber;
        state.currentElement.startingLineNumber += lineNumber;
    }

    return multiClauseNode;
};

const parseMainClause = (multiClauseNode, content, state) => {

    const isifTagContent    = state.currentElement.asString;
    const clauseContentNode = new IsmlNode(isifTagContent, state.currentElement.startingLineNumber, multiClauseNode.globalPos);

    multiClauseNode.addChild(clauseContentNode);

    if (content.trim()) {
        TreeBuilder.parse(content, state, clauseContentNode);
    } else {
        clauseContentNode.value += content;
    }

    // TODO: Under certain scenarios, there is a buggy duplicated
    // "isif" tag. The code below merges both "isif" nodes;
    if (multiClauseNode.getNumberOfChildren() > 1 && multiClauseNode.children[1].isOfType('isif')) {
        const firstIsifNode = multiClauseNode.children[0];
        const children      = multiClauseNode.children[1].children;

        for (let i = 0; i < children.length; i++) {
            firstIsifNode.addChild(children[i]);
        }

        multiClauseNode.children.splice(1, 1);
    }

    return clauseContentNode;
};

const parseElseClause = (multiClauseNode, content, state) => {

    const clauseValue             = ParseUtils.getClauseContent(content);
    const clauseInnerContent      = ParseUtils.getClauseInnerContent(content);
    const isifTagLineNumber       = multiClauseNode.children[0].lineNumber;
    const accumulatedLineBreakQty = ParseUtils.getLineBreakQty(multiClauseNode.toString().trimStart());
    const clauseLineNumber        = isifTagLineNumber + accumulatedLineBreakQty;
    const clauseGlobalPos         = getIselseNodeGlobalPos(multiClauseNode);
    const clauseContentNode       = new IsmlNode(clauseValue, clauseLineNumber, clauseGlobalPos);

    multiClauseNode.addChild(clauseContentNode);

    const currentPos = state.currentPos;
    state.currentPos = clauseGlobalPos + clauseValue.length - GeneralUtils.offset(state.currentLineNumber);

    if (content.trim()) {
        TreeBuilder.parse(clauseInnerContent, state, clauseContentNode);
    } else {
        clauseContentNode.value += content;
    }

    state.currentPos = currentPos;

    return clauseContentNode;
};

const getIselseNodeGlobalPos = multiClauseNode => {
    const stringifiedSiblings = multiClauseNode.toString().trimStart();
    const lineBreakQty        = ParseUtils.getLineBreakQty(stringifiedSiblings);

    const clauseGlobalPos = multiClauseNode.globalPos +
        stringifiedSiblings.length +
        lineBreakQty;

    return clauseGlobalPos;
};

module.exports.run = run;
