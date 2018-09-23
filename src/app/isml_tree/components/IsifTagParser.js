const IsmlNode = require('../IsmlNode');
const TreeBuilder = require('../TreeBuilder');
const MultiClauseNode = require('../MultiClauseNode');
const MaskUtils = require('../MaskUtils');

const ELSE_TAG = '<iselse';

const run = function(multiClauseNode, content, isifTagContent) {

    const clauseList = content.split(ELSE_TAG);
    let resultNode = multiClauseNode;

    if (!(multiClauseNode instanceof MultiClauseNode)) {
        resultNode = new MultiClauseNode();
        multiClauseNode.addChild(resultNode);
    }

    clauseList.forEach( (item, index) => {
        if (index === 0) {
            getMainClauseNode(resultNode, item, isifTagContent);
        } else {
            getElseClauseNode(resultNode, item);
        }
    });

    return multiClauseNode;
};

const getMainClauseNode = (resultNode, content, isifTagContent) => {

    const clauseContentNode = new IsmlNode(isifTagContent);
    resultNode.addChild(clauseContentNode);

    TreeBuilder.parse(clauseContentNode, content);

    return clauseContentNode;
};

const getElseClauseNode = (resultNode, content) => {

    const clauseContent = getClauseContent(content),
        clauseInnerContent = getClauseInnerContent(content),
        clauseContentNode = new IsmlNode(clauseContent);

    resultNode.addChild(clauseContentNode);

    TreeBuilder.parse(clauseContentNode, clauseInnerContent);

    return clauseContentNode;
};

function getClauseContent(content) {
    const processedContent = MaskUtils.maskIgnorableContent(content);
    return ELSE_TAG + content.substring(0, processedContent.indexOf('>') + 1);
}

function getClauseInnerContent(content) {
    const processedContent = MaskUtils.maskIgnorableContent(content);
    return content.substring(content.indexOf('>') + 1, processedContent.length);
}

module.exports.run = run;
