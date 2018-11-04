const IsmlNode = require('../IsmlNode');
const TreeBuilder = require('../TreeBuilder');
const MultiClauseNode = require('../MultiClauseNode');
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
            getMainClauseNode(resultNode, item, state) :
            getElseClauseNode(resultNode, item, state);
    });

    return multiClauseNode;
};

const getMainClauseNode = (resultNode, content, state) => {

    const isifTagContent = state.currentElement.asString;
    const clauseContentNode = new IsmlNode(isifTagContent, state.currentElement.startingLineNumber);
    resultNode.addChild(clauseContentNode);

    TreeBuilder.parse(content, state, clauseContentNode);

    return clauseContentNode;
};

const getElseClauseNode = (resultNode, content, state) => {

    const clauseContent = getClauseContent(content),
        clauseInnerContent = getClauseInnerContent(content),
        clauseContentNode = new IsmlNode(clauseContent, state.currentElement.startingLineNumber);

    resultNode.addChild(clauseContentNode);

    TreeBuilder.parse(clauseInnerContent, state, clauseContentNode);

    return clauseContentNode;
};

const getClauseList = (content, state) => {

    const isifTagContent = state.currentElement.asString;
    const clauseStringList = [];

    let tagList = getAllConditionalTags(content);
    tagList = getOutterTagList(tagList);

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

const getAllConditionalTags = content => {

    const tagList = [];
    const maskedContent = MaskUtils.maskIgnorableContent(content);

    for (let i = 0; i < maskedContent.length; i++) {
        if (content.charAt(i - 1) === '<') {
            let end = Math.min(maskedContent.substring(i).indexOf(' '), maskedContent.substring(i).indexOf('>'));
            if (end === -1) {
                end = Math.max(maskedContent.substring(i).indexOf(' '), maskedContent.substring(i).indexOf('>'));
            }
            const tag = content.substring(i, i + end);
            if (['isif', 'iselse', 'iselseif', '/isif'].indexOf(tag) !== -1) {
                tagList.push({
                    tag,
                    startPos: i - 1
                });
            }
        }
    }

    return tagList;
};

const getOutterTagList = tagList => {

    let depth = 0;

    tagList = tagList.filter(tagObj => {
        if (tagObj.tag.startsWith('isif')) {
            depth += 1;
        }

        if (depth === 0) {
            return true;
        }

        if (tagObj.tag === '/isif') {
            depth -= 1;
        }

        return false;
    });

    return tagList;
};

function getClauseContent(content) {
    const processedContent = MaskUtils.maskIgnorableContent(content);
    return content.substring(0, processedContent.indexOf('>') + 1);
}

function getClauseInnerContent(content) {
    const processedContent = MaskUtils.maskIgnorableContent(content);
    return content.substring(content.indexOf('>') + 1, processedContent.length);
}

module.exports.run = run;