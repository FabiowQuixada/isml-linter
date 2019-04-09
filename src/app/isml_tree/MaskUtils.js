/**
 * Replaces '${...}' with '${___}', so it facilites next processes. For Example,
 * if ${ 3 < 4 } is present, the '<' symbol might be thought as an opening tag
 * symbol. The same is valid for <isscript> and <iscomment> tags;
 */

const placeholderSymbol = '_';

const maskIgnorableContent = content => {

    content = maskInBetween(content, '${', '}');
    content = maskInBetween(content, '<isscript>', '</isscript>');
    content = maskInBetweenForTagWithAttributes(content, '<script', '</script>');
    content = maskInBetweenForTagWithAttributes(content, '<style', '</style>');
    content = maskInBetween(content, '<iscomment>', '</iscomment>');
    content = maskInBetween(content, '<!--', '-->');
    content = maskNestedIsmlElements(content);

    return content;
};

/**
 * Masks nested isml elements so that they don't interfere with the Isml Dom tree building;
 *
 * An example, it turns:
 *      <div <isif ... > class="wrapper">
 * into:
 *      <div ___________ class="wrapper">
 */
const maskNestedIsmlElements = content => {

    let result    = '';
    let depth     = 0;
    let firstTime = true;

    for (let i = 0; i < content.length; i++) {
        const currentChar = content.charAt(i);

        if (currentChar === '<') {
            depth += 1;
        }

        if (content.charAt(i - 1) === '>') {
            depth -= 1;
        }

        if (depth > 1) {
            result += '_';
        } else {
            result += content.charAt(i);
        }

        if (depth === 0 && firstTime) {
            firstTime = false;
        }
    }

    return result;
};

const getRegex = expression => {
    return new RegExp(expression.replace('$', '\\$').replace('{', '\\{'), 'g');
};

const getMatchingIndexList = (content, expression) => {

    const regex             = getRegex(expression);
    const matchingIndexList = [];
    let match               = regex.exec(content);

    while (match !== null) {
        matchingIndexList.push(match.index);
        match = regex.exec(content);
    }

    return matchingIndexList;
};

const getMatchingIndexListForTagWithAtrributes = (content, expression) => {

    const regex             = getRegex(expression);
    const matchingIndexList = [];
    let match               = regex.exec(content);

    while (match !== null) {
        const substring     = content.substring(match.index);
        const closingTagPos = substring.indexOf('>');
        matchingIndexList.push(match.index + closingTagPos - expression.length + 1);
        match               = regex.exec(content);
    }

    return matchingIndexList;
};

const maskInBetween = (content, startString, endString) => {
    const openingMatchList = getMatchingIndexList(content, startString);
    return getMatchingIndexes(content, endString, openingMatchList, startString);
};

const maskInBetweenForTagWithAttributes = (content, startString, endString) => {
    const openingMatchList = getMatchingIndexListForTagWithAtrributes(content, startString);
    return getMatchingIndexes(content, endString, openingMatchList, startString);
};

const getMatchingIndexes = (content, endString, openingMatchList, startString) => {
    const closingMatchList = getMatchingIndexList(content, endString);
    let result             = '';
    let isInBetween        = false;
    let activePos          = -1;

    for (let i = 0; i < content.length; ++i) {
        if (isInBetween) {
            if (closingMatchList.indexOf(i) !== -1) {
                activePos   = -1;
                isInBetween = false;
                result      += content[i];
            } else {
                result      += placeholderSymbol;
            }
        } else {
            if (openingMatchList.indexOf(i - 1) !== -1) {
                activePos = i;
            }

            isInBetween = activePos !== -1 && i >= activePos + startString.length - 1;

            if (isInBetween) {
                result += placeholderSymbol;
            } else {
                result += content[i];
            }
        }
    }

    return result;
};

module.exports = {
    maskIgnorableContent
};
