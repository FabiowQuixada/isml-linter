const IsmlNode = require('../IsmlNode');
const TreeBuilder = require('../TreeBuilder');
const MultiClauseNode = require('../MultiClauseNode');
const ParseUtils = require('./ParseUtils');
const MaskUtils = require('../MaskUtils');

const run = function(content, state) {

    const multiClauseNode = state.parentNode.newestChildNode;

    const clauseList = getClauseList(content, state);
    let resultNode = multiClauseNode;

    if (!(multiClauseNode instanceof MultiClauseNode)) {
        resultNode = new MultiClauseNode();
        multiClauseNode.addChild(resultNode);
    }

    clauseList.forEach( (item, index) => {
        index === 0 ?
            parseMainClause(resultNode, item, state) :
            parseElseClause(resultNode, item, state);
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

const getClauseList = (content, state) => {

    const isifTagContent = state.currentElement.asString;
    const clauseStringList = [];

    let tagList = ParseUtils.getAllConditionalTags(content);
    tagList = ParseUtils.getOutterConditionalTagList(tagList);

    let lastIndex = 0;
    tagList.forEach( tagObj => {
        clauseStringList.push(content.substring(lastIndex, tagObj.startPos));
        lastIndex = tagObj.startPos;
    });

    clauseStringList.push(content.substring(lastIndex, content.length));

    const result = [];

    clauseStringList.forEach( (clauseString, index) => {
        const node = new IsmlNode();
        let innerContent = '';

        if (index === 0) {
            node.setValue(isifTagContent);
            innerContent = clauseString;

        } else {
            const maskedClauseString = MaskUtils.maskIgnorableContent(clauseString);
            const pos = maskedClauseString.indexOf('>');
            const substring = clauseString.substring(0, pos+1);
            innerContent = clauseString.substring(pos+2, clauseString.length);
            node.setValue(substring);
        }

        TreeBuilder.parse(innerContent, state, node);

        result.push(node);
    });

    return clauseStringList;
};

module.exports.run = run;
