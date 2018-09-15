const MultiClauseNode = require('../MultiClauseNode');
const IsmlNode = require('../IsmlNode');
const TreeBuilder = require('../TreeBuilder');

const CLOSING_TAG = '</isif',
    ELSE_TAG = '<iselse',
    CLOSING_CHAR = '>';

exports.run = function(parentNode, content) {

    const invisibleNode = new MultiClauseNode();

    invisibleNode.setValue('(invisible if)');
    parentNode.addChild(invisibleNode);

    if (content.indexOf(ELSE_TAG) !== -1) {
        buildMainClause(invisibleNode, content);
        buildElseClause(invisibleNode, content);
    }

    return parentNode;
};

const buildMainClause = (invisibleNode, content) => {

    const closingCharPos = content.indexOf(CLOSING_CHAR),
        isifNodeValue = content.substring(0, closingCharPos + 1),
        clauseContentNode = new IsmlNode(),
        clauseContent = content.substring(closingCharPos + 1, content.indexOf(ELSE_TAG));

    clauseContentNode.setValue(isifNodeValue);
    invisibleNode.addClause(clauseContentNode);
    TreeBuilder.parse(clauseContentNode, clauseContent);
};

const buildElseClause = (invisibleNode, content) => {

    const closingCharPos = getClosingCharPosition(content) + 1,
        clauseValue = content.substring(content.indexOf(ELSE_TAG), closingCharPos),
        clauseContent = content.substring(closingCharPos, content.indexOf(CLOSING_TAG)),
        clauseContentNode = new IsmlNode();

    clauseContentNode.setValue(clauseValue);
    invisibleNode.addClause(clauseContentNode);
    TreeBuilder.parse(clauseContentNode, clauseContent);
};

const getClosingCharPosition = (content) => {

    const preIndex = content.indexOf(ELSE_TAG),
        searchIndex = preIndex + content.substring(preIndex).indexOf(CLOSING_CHAR);

    return searchIndex;
};
