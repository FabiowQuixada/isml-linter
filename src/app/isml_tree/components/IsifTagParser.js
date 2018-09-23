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

        let node = null;

        if (index === 0) {
            node = getMainClauseNode(item, isifTagContent);
        } else {
            node = getElseClauseNode(item);
        }

        resultNode.addChild(node);
    });

    return multiClauseNode;
};

const getMainClauseNode = (content, isifTagContent) => {

    const clauseContentNode = new IsmlNode(isifTagContent);

    TreeBuilder.parse(clauseContentNode, content);

    return clauseContentNode;
};

const getElseClauseNode = (content) => {

    const clauseContent = getClauseContent(content),
        clauseInnerContent = getClauseInnerContent(content),
        clauseContentNode = new IsmlNode(clauseContent);

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
