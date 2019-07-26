/**
 * Replaces '${...}' with '${___}', so it facilitates next processes. For Example,
 * if ${ 3 < 4 } is present, the '<' symbol might be thought as an opening tag
 * symbol. The same is valid for <isscript> and <iscomment> tags;
 */

const placeholderSymbol = '_';

const maskIgnorableContent = (content, isMaskBorders) => {

    content = maskInBetween(content, 'iscomment', isMaskBorders);
    content = maskInBetween(content, '${', '}', isMaskBorders);
    content = maskInBetween(content, 'isscript', isMaskBorders);
    content = maskInBetweenForTagWithAttributes(content, 'script');
    content = maskInBetweenForTagWithAttributes(content, 'style');
    content = maskInBetween(content, '<!---', '--->', isMaskBorders);
    content = maskInBetween(content, '<!--', '-->', isMaskBorders);
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

const getMatchingIndexList = (content, expression, openingMatchList) => {

    const regex             = getRegex(expression);
    const matchingIndexList = [];
    let match               = regex.exec(content);
    let i                   = 0;

    while (match !== null) {
        const matchIndex = match.index;

        if (!openingMatchList || openingMatchList[i] <= matchIndex && (!openingMatchList[i + 1] || matchIndex < openingMatchList[i + 1])) {
            matchingIndexList.push(matchIndex);
            ++i;
        }

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
        matchingIndexList.push(match.index + closingTagPos + 1);
        match               = regex.exec(content);
    }

    return matchingIndexList;
};

const maskInBetween = (content, startString, endString, isMaskBorders) => {

    let processedStartingString = startString;
    let processedEndString      = endString;

    if (!endString) {
        processedStartingString = `<${startString}>`;
        processedEndString      = `</${startString}>`;
    }
    const openingMatchList = getMatchingIndexList(content, processedStartingString);
    return getMatchingIndexes(content, processedEndString, openingMatchList, processedStartingString, isMaskBorders);
};

const maskInBetweenForTagWithAttributes = (content, rawStartString) => {

    const startingString   = `<${rawStartString}>`;
    const endString        = `</${rawStartString}>`;
    const openingMatchList = getMatchingIndexListForTagWithAtrributes(content, startingString);
    return getMatchingIndexes(content, endString, openingMatchList, startingString);
};

const removeEmptyIsmlExpressionFromIndexes = (startString, endString, openingMatchList, closingMatchList) => {

    let finalOpeningMatchList = [];
    let finalClosingMatchList = [];
    if (startString === '${' && endString === '}') {
        const matchQty = openingMatchList.length;

        for (let i = 0; i < matchQty; i++) {
            if (openingMatchList[i] !== closingMatchList[i] - 2) {
                finalOpeningMatchList.push(openingMatchList[i]);
                finalClosingMatchList.push(closingMatchList[i]);
            }
        }
    } else {
        finalOpeningMatchList = openingMatchList;
        finalClosingMatchList = closingMatchList;
    }

    return {
        openingMatchList : finalOpeningMatchList,
        closingMatchList : finalClosingMatchList
    };
};

const getMatchingIndexes = (content, endString, paramOpeningMatchList, startString, isMaskBorders) => {
    let closingMatchList    = getMatchingIndexList(content, endString, paramOpeningMatchList);
    let result              = '';
    let isInBetween         = false;
    const currentOpeningTag = {
        endingGlobalPos : null,
        arrayIndex         : null
    };

    const matchingIndexListResult = removeEmptyIsmlExpressionFromIndexes(startString, endString, paramOpeningMatchList, closingMatchList);

    const openingMatchList = matchingIndexListResult.openingMatchList;
    closingMatchList       = matchingIndexListResult.closingMatchList;

    for (let i = 0; i < content.length; ++i) {
        if (isInBetween) {
            if (closingMatchList.indexOf(i) !== -1) {
                currentOpeningTag.endingGlobalPos = null;
                isInBetween                       = false;
                result                            += content[i];
            } else {
                result      += placeholderSymbol;
            }
        } else {
            const newLocal = openingMatchList.indexOf(i - 1);
            if (newLocal !== -1) {
                currentOpeningTag.endingGlobalPos = i;
                currentOpeningTag.arrayIndex      = newLocal;
            }

            isInBetween = currentOpeningTag.endingGlobalPos &&
             i >= currentOpeningTag.endingGlobalPos + startString.length - 1;

            if (openingMatchList[currentOpeningTag.arrayIndex] === closingMatchList[currentOpeningTag.arrayIndex]) {
                isInBetween                       = false;
                currentOpeningTag.arrayIndex      = null;
                currentOpeningTag.endingGlobalPos = null;
            }

            if (isInBetween) {
                result += placeholderSymbol;
            } else {
                result += content[i];
            }
        }
    }

    if (isMaskBorders) {
        const maskedStartString = mask(startString);
        const maskedEndString   = mask(endString);

        result = result
            .replace(new RegExp(startString, 'g'), maskedStartString)
            .replace(new RegExp(endString, 'g'), maskedEndString);
    }

    return result;
};

const mask = content => {
    let maskedContent = '';

    for (let i = 0; i < content.length; i++) {
        maskedContent += '_';
    }

    return maskedContent;
};

module.exports = {
    maskIgnorableContent,
    maskInBetween,
    maskInBetweenForTagWithAttributes
};
