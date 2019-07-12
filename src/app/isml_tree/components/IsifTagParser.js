const IsmlNode    = require('../IsmlNode');
const TreeBuilder = require('../TreeBuilder');
const ParseUtils  = require('./ParseUtils');
const Constants   = require('../../../app/Constants');

const run = function(content, state) {

    const multiClauseNode = state.parentNode.newestChildNode;
    const clauseList      = ParseUtils.getClauseList(content);
    let lineNumber        = 0;

    clauseList.forEach( (clauseContent, index) => {
        index === 0 ?
            parseMainClause(multiClauseNode, clauseContent, state) :
            parseElseClause(multiClauseNode, clauseContent, state);

        lineNumber                              = (clauseContent.match(new RegExp(Constants.EOL, 'g')) || []).length;
        state.currentLineNumber                 += lineNumber;
        state.currentElement.startingLineNumber += lineNumber;
    });

    // TODO: Under certain scenarios, there is a duplicated "isif" tag.
    // The code below merges both "isif" nodes;
    if (multiClauseNode.getNumberOfChildren() > 1 && multiClauseNode.getChild(1).isOfType('isif')) {
        const firstIsifNode = multiClauseNode.getChild(0);

        multiClauseNode.getChild(1).getChildren().forEach( child => {
            firstIsifNode.addChild(child);
        });

        multiClauseNode.getChildren().splice(1, 1);
    }

    return multiClauseNode;
};

const parseMainClause = (multiClauseNode, content, state) => {

    const isifTagContent    = state.currentElement.asString;
    const clauseContentNode = new IsmlNode(isifTagContent, state.currentElement.startingLineNumber, state.currentPos);

    multiClauseNode.addChild(clauseContentNode);
    TreeBuilder.parse(content, state, clauseContentNode);

    return clauseContentNode;
};

const parseElseClause = (multiClauseNode, content, state) => {

    const clauseValue             = ParseUtils.getClauseContent(content);
    const clauseInnerContent      = ParseUtils.getClauseInnerContent(content);
    const globalPos               = state.content.indexOf(content);
    const isifTagLineNumber       = multiClauseNode.getChild(0).getLineNumber();
    const accumulatedLineBreakQty = (multiClauseNode.toString().trimStart().match(new RegExp(Constants.EOL, 'g')) || []).length;
    const clauseContentNode       = new IsmlNode(clauseValue, isifTagLineNumber + accumulatedLineBreakQty, globalPos);

    multiClauseNode.addChild(clauseContentNode);
    TreeBuilder.parse(clauseInnerContent, state, clauseContentNode);

    return clauseContentNode;
};

module.exports.run = run;
