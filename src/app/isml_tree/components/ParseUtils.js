
/**
 * The functions defined in this file do not create or modify a state, they
 * simply analyze it and return relevant information;
 */

const MaskUtils        = require('../MaskUtils');
const ClosingTagFinder = require('./ClosingTagFinder');

const ISIF = '<isif';

const pickInnerContent  = (state, content) => {
    const innerContentStartPos = state.currentElement.endPosition + 1;
    const innerContentEndPos   = state.currentElemClosingTagInitPos;
    return content.substring(innerContentStartPos, innerContentEndPos);
};

const getUpdateContent = state => {
    let content                      = state.originalContent;
    const currentElementInitPosition = state.currentElement.initPosition;
    content                          = content.substring(currentElementInitPosition, content.length);
    return content;
};

const getNextNonEmptyChar = content => {
    return content.replace(/\n/g, '').trim()[0];
};

module.exports.getLineBreakQty = function(string) {
    return (string.match(/\n/g) || []).length;
};

module.exports.getNextNonEmptyCharPos = content => {
    const firstNonEmptyChar = getNextNonEmptyChar(content);
    return content.indexOf(firstNonEmptyChar);
};

module.exports.getPostClosingTagContentUpToLneBreak = function(content, startPos) {
    let postContent = '';

    for (let i = startPos + 1; i < content.length; i++) {
        const currentChar = content.charAt(i);

        if (currentChar !== '\n' && currentChar !== '\t') {
            break;
        }

        postContent += currentChar;
    }

    return postContent;
};

module.exports.isOpeningElem = function(state) {

    const content    = state.originalContent;
    const currPos    = state.currentElement.initPosition;
    const currenChar = content.charAt(currPos);
    const nextChar   = content.charAt(currPos + 1);

    return currenChar === '<' && nextChar !== '/';
};

module.exports.isStackable = function(elem) {
    return !elem.startsWith('!--') &&
            elem !== 'iselse' &&
            elem !== 'iselseif';
};

module.exports.isNextElementATag = function(state) {
    return getNextNonEmptyChar(state) === '<';
};

module.exports.isNextElementIsifTag = function(content) {
    return content.trim().startsWith(ISIF);
};

module.exports.isNextElementHtmlComment = function(content) {
    return content.trim().startsWith('<!--');
};

module.exports.isCurrentElementIsifTag = function(state) {
    return state.currentElement.asString.trim().startsWith(ISIF);
};

module.exports.isOpeningIsmlExpression = function(state) {

    const content    = state.originalContent;
    const currentPos = state.currentPos;
    const currChar   = content.charAt(currentPos);
    const nextChar   = content.charAt(currentPos + 1);

    return currChar === '$' && nextChar === '{';
};

module.exports.isClosingIsmlExpression = function(state) {

    const content          = state.originalContent;
    const currentPos       = state.currentPos;
    const insideExpression = state.insideExpression;

    return insideExpression && content.charAt(currentPos - 1) === '}';
};

module.exports.getInnerContent = function(oldState) {
    let state     = Object.assign({}, oldState);
    const content = getUpdateContent(state);
    state         = ClosingTagFinder.getCorrespondentClosingElementPosition(content, state);

    return pickInnerContent(state, content);
};

module.exports.getNumberOfPrecedingEmptyLines = function(content) {

    const lineArray  = content.split('\n');
    let lineBreakQty = 0;

    lineArray.some( line => {
        if (!line.trim()) {
            lineBreakQty++;
            return false;
        }
        return true;
    });

    return lineBreakQty;
};

module.exports.isSkipIteraction = function(state) {
    return state.ignoreUntil && state.ignoreUntil >= state.currentPos ||
            state.insideTag && state.insideExpression;
};

module.exports.isCorrespondentElement = function(state, elem) {
    return `/${state.elementStack[state.elementStack.length-1]}` === elem;
};

module.exports.getFirstElementType = function(elementAsString) {
    let result = elementAsString.substring(elementAsString.indexOf('<') + 1, elementAsString.indexOf('>'));

    // In case the tag has attributes;
    if (result.indexOf(' ') !== -1) {
        result = result.split(' ')[0];
    }

    return result;
};

module.exports.getCurrentElementEndPosition = function(content) {

    content                      = MaskUtils.maskIgnorableContent(content);
    const currentElemEndPosition = content.indexOf('<');

    return {
        currentElemEndPosition,
        content
    };
};

module.exports.getClauseContent = function(content) {
    const processedContent = MaskUtils.maskIgnorableContent(content);
    return content.substring(0, processedContent.indexOf('>') + 1);
};

module.exports.getClauseInnerContent = function(content) {
    const processedContent = MaskUtils.maskIgnorableContent(content);
    return content.substring(content.indexOf('>') + 1, processedContent.length);
};

module.exports.getAllConditionalTags = function(content) {

    const tagList       = [];
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
                    startPos : i - 1
                });
            }
        }
    }

    return tagList;
};

module.exports.getOutterConditionalTagList = function(tagList) {

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

module.exports.isStopIgnoring = function(state) {
    return state.ignoreUntil && state.ignoreUntil < state.currentPos && state.ignoreUntil !== state.content.length + 1;
};

module.exports.getClauseList = function(content) {

    const clauseStringList = [];

    let tagList = this.getAllConditionalTags(content);
    tagList     = this.getOutterConditionalTagList(tagList);

    let lastIndex = 0;
    tagList.forEach( tagObj => {
        clauseStringList.push(content.substring(lastIndex, tagObj.startPos));
        lastIndex = tagObj.startPos;
    });

    clauseStringList.push(content.substring(lastIndex, content.length));

    return clauseStringList;
};

/**
     * Checks if the parsing process is in the following state:
     * <div ... <isif ...> > </div>
     */
module.exports.isIsmlTagInsideHtmlTag = function(state) {
    return state.depth !== 0;
};
