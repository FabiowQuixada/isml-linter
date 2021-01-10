/**
 * Replaces '${...}' with '${___}', so it facilitates next processes. For Example,
 * if ${ 3 < 4 } is present, the '<' symbol might be thought as an opening tag
 * symbol. The same is valid for <isscript> and <iscomment> tags;
 */

const ParseUtils     = require('./ParseUtils');
const ExceptionUtils = require('../util/ExceptionUtils');

const placeholderSymbol = '_';

const maskIgnorableContent = (content, isMaskBorders, templatePath) => {

    content = maskInBetween(content, 'iscomment', isMaskBorders);
    content = maskInBetween(content, '${', '}', isMaskBorders);
    content = maskInBetween(content, '<!---', '--->', isMaskBorders);
    content = maskInBetween(content, '<!--', '-->', isMaskBorders);
    content = maskInBetweenIsscriptTags(content);

    checkTagBalance(content, templatePath);


    content = maskInBetween2(content, '<', '>');
    content = maskInBetweenForTagWithAttributes(content, 'script');
    content = maskInBetweenForTagWithAttributes(content, 'style');
    content = maskNestedIsmlElements(content);

    return content;
};

const checkTagBalance = (content, templatePath) => {
    let depth = 0;

    for (let i = 0; i < content.length; i++) {
        const char             = content[i];
        const remainingContent = content.substring(i);

        if (char === '<') {
            depth++;
        }

        if (char === '>') {
            depth--;
        }

        // Only ISML tags can be within HTML tags;
        if (depth === 2 &&
            remainingContent.startsWith('<') &&
            !remainingContent.startsWith('<is') &&
            !remainingContent.startsWith('<!') &&
            !remainingContent.startsWith('</is')
        ) {
            const lineNumber = ParseUtils.getLineBreakQty(content.substring(0, i)) + 1;

            throw ExceptionUtils.invalidCharacterError(
                '<',
                lineNumber,
                i,
                1,
                templatePath
            );
        }
    }
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

    const isContentUnbalanced = checkIfUnbalanced(content);
    let result                = '';
    let depth                 = 0;
    let firstTime             = true;

    if (isContentUnbalanced) {
        return isContentUnbalanced;
    }

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

const maskInBetween = (content, startString, endString, isMaskBorders) => {

    let processedStartingString = startString;
    let processedEndString      = endString;

    if (!endString) {
        processedStartingString = `<${startString}>`;
        processedEndString      = `</${startString}>`;
    }

    return getMatchingIndexes(content, processedStartingString, processedEndString, isMaskBorders);
};

const getMatchingLists = (content, startString, endString) => {
    const openingMatchList    = [];
    const closingMatchList    = [];
    const emptyElementPattern = startString + endString;

    for (let i = 0; i < content.length; i++) {
        const substring = content.substring(i);

        if (substring.startsWith(startString)) {
            if (openingMatchList.length === closingMatchList.length && !substring.startsWith(emptyElementPattern)) {
                openingMatchList.push(i);
            }
        } else if (substring.startsWith(endString)) {
            if (openingMatchList.length === closingMatchList.length + 1) {
                closingMatchList.push(i);
            }
        }
    }

    return {
        openingMatchList,
        closingMatchList
    };
};

const maskInBetweenForTagWithAttributes = (content, rawStartString) => {

    const startingString = `<${rawStartString}>`;
    const endString      = `</${rawStartString}>`;
    return getMatchingIndexes(content, startingString, endString);
};

const checkIfDeprecatedIsmlCommentIsUnbalanced = (content, startString, openingMatchList, closingMatchList) => {
    if (startString === '<!---' && openingMatchList.length !== closingMatchList.length) {
        let globalPos;
        let length;

        for (let i = 0; i < openingMatchList.length; i++) {
            const openingElementPos = openingMatchList[i];
            const closingElementPos = closingMatchList[i];

            if (!closingElementPos || closingElementPos < openingElementPos) {
                const elemContent = content.substring(openingElementPos, content.indexOf('-->') + 3);
                globalPos         = openingElementPos;
                length            = elemContent.length;
            }
        }

        const lineNumber = ParseUtils.getLineBreakQty(content.substring(0, globalPos)) + 1;

        throw {
            type : ExceptionUtils.types.UNCLOSED_DEPRECATED_ISML_COMMENT,
            globalPos,
            lineNumber,
            length
        };
    }

    return false;
};

const maskInBetween2 = (content, startString, endString) => {
    let depth  = 0;
    let result = '';

    for (let i = 0; i < content.length; i++) {
        const element = content[i];

        if (element === endString) {
            depth--;
        }

        result += depth > 0 ? '_' : element;

        if (element === startString) {
            depth++;
        }
    }

    return result;
};

const maskInBetweenIsscriptTags = content => {
    let result  = '';

    const startString = '<isscript>';
    const endString   = '</isscript>';

    const contentToBeMaskedStartPos = content.indexOf(startString) + startString.length - 1;
    const contentToBeMaskedEndPos   = content.indexOf(endString);


    for (let i = 0; i < content.length; i++) {
        const element = content[i];

        result += contentToBeMaskedStartPos < i  && i < contentToBeMaskedEndPos ?
            '_' :
            element;
    }

    return result;
};

const getMatchingIndexes = (content, startString, endString, isMaskBorders) => {
    const matchingLists     = getMatchingLists(content, startString, endString);
    const openingMatchList  = matchingLists.openingMatchList;
    const closingMatchList  = matchingLists.closingMatchList;
    let result              = '';
    let isInBetween         = false;
    const currentOpeningTag = {
        endingGlobalPos : null,
        arrayIndex         : null
    };

    const isDeprecatedIsmlCommentUnbalanced = checkIfDeprecatedIsmlCommentIsUnbalanced(content, startString, openingMatchList, closingMatchList);

    if (isDeprecatedIsmlCommentUnbalanced) {
        return isDeprecatedIsmlCommentUnbalanced;
    }

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

const checkIfUnbalanced = content => {
    const openingCharQty = ParseUtils.getCharOccurrenceQty(content, '<');
    const closingCharQty = ParseUtils.getCharOccurrenceQty(content, '>');
    let depth            = 0;

    if (openingCharQty !== closingCharQty) {
        for (let i = 0; i < content.length; i++) {
            const currentChar = content.charAt(i);

            if (currentChar === '<') {
                depth += 1;

                const isNextElementIsmlTag = content[i + 1] + content[i + 2] === 'is' || content[i + 1] + content[i + 2]  + content[i + 3] === '/is';

                if (depth > 1 && !isNextElementIsmlTag) {
                    const lineNumber = ParseUtils.getLineBreakQty(content.substring(0, i)) + 1;

                    return {
                        error: {
                            character    : '<',
                            lineNumber   : lineNumber,
                            globalPos    : i,
                            elemLength   : 1
                        }
                    };
                }
            }

            if (content.charAt(i - 1) === '>') {
                depth -= 1;
            }
        }
    }

    return false;
};

module.exports = {
    maskIgnorableContent,
    maskInBetween,
    maskInBetweenForTagWithAttributes
};
