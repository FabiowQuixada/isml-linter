const IsmlNode = require('../IsmlNode');
const TreeBuilder = require('../TreeBuilder');
const MultiClauseNode = require('../MultiClauseNode');

const ELSE_TAG = '<iselse';

exports.run = function(parentNode, content, isifTagContent) {

    const clauseList = content.split(ELSE_TAG);
    let resultNode = parentNode;

    if (!(parentNode instanceof MultiClauseNode)) {
        resultNode = new MultiClauseNode();
        parentNode.addChild(resultNode);
    }

    clauseList.forEach( (item, index) => {
        if (index === 0) {
            buildMainClause(resultNode, item, isifTagContent);
        } else {
            buildElseClause(resultNode, item);
        }
    });

    return parentNode;
};

const buildMainClause = (invisibleNode, content, isifTagContent) => {

    const clauseContentNode = new IsmlNode();

    clauseContentNode.setValue(isifTagContent);
    invisibleNode.addClause(clauseContentNode);
    TreeBuilder.parse(clauseContentNode, content);
};

const buildElseClause = (invisibleNode, content) => {

    const clauseContentNode = new IsmlNode(),
        clauseContent = getClauseContent(content),
        clauseInnerContent = getClauseInnerContent(content);

    clauseContentNode.setValue(clauseContent);
    invisibleNode.addClause(clauseContentNode);
    TreeBuilder.parse(clauseContentNode, clauseInnerContent);
};

function getClauseContent(item) {
    return ELSE_TAG + item.substring(0, item.indexOf('>') + 1);
}

function getClauseInnerContent(item) {
    return item.substring(item.indexOf('>') + 1, item.length);
}
