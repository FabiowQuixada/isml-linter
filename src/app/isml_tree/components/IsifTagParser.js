const IsmlNode = require('../IsmlNode');
const TreeBuilder = require('../TreeBuilder');
const ParseUtils = require('./ParseUtils');

const run = function(content, state) {

    const multiClauseNode = state.parentNode.newestChildNode;
    const clauseList = getClauseList(content);
    let lineNumber = 0;

    clauseList.forEach( (clauseContent, index) => {
        index === 0 ?
            parseMainClause(multiClauseNode, clauseContent, state) :
            parseElseClause(multiClauseNode, clauseContent, state);

        lineNumber = (clauseContent.match(/\n/g) || []).length;
        state.currentLineNumber += lineNumber;
        state.currentElement.startingLineNumber += lineNumber;
    });

    return multiClauseNode;
};

const parseMainClause = (resultNode, content, state) => {

    const isifTagContent = state.currentElement.asString;
    const clauseContentNode = new IsmlNode(isifTagContent, state.currentElement.startingLineNumber);

    resultNode.addChild(clauseContentNode);
    TreeBuilder.parse(content, state, clauseContentNode);

    return clauseContentNode;
};

const parseElseClause = (resultNode, content, state) => {

    const clauseContent = ParseUtils.getClauseContent(content),
        clauseInnerContent = ParseUtils.getClauseInnerContent(content),
        clauseContentNode = new IsmlNode(clauseContent, state.currentElement.startingLineNumber);

    resultNode.addChild(clauseContentNode);

    TreeBuilder.parse(clauseInnerContent, state, clauseContentNode);

    return clauseContentNode;
};

const getClauseList = content => {

    const clauseStringList = [];

    let tagList = ParseUtils.getAllConditionalTags(content);
    tagList = ParseUtils.getOutterConditionalTagList(tagList);

    let lastIndex = 0;
    tagList.forEach( tagObj => {
        clauseStringList.push(content.substring(lastIndex, tagObj.startPos));
        lastIndex = tagObj.startPos;
    });

    clauseStringList.push(content.substring(lastIndex, content.length));

    return clauseStringList;
};

module.exports.run = run;
