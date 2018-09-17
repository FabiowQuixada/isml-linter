const IsmlNode = require('../IsmlNode');
const TreeBuilder = require('../TreeBuilder');
const MultiClauseNode = require('../MultiClauseNode');

const ELSE_TAG = '<iselse';

exports.run = function(multiClauseNode, content, isifTagContent) {

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

        resultNode.addClause(node);
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

function getClauseContent(item) {
    return ELSE_TAG + item.substring(0, item.indexOf('>') + 1);
}

function getClauseInnerContent(item) {
    return item.substring(item.indexOf('>') + 1, item.length);
}
