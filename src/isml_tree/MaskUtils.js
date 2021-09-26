/**
 * Replaces '${...}' with '${___}', so it facilitates next processes. For Example,
 * if ${ 3 < 4 } is present, the '<' symbol might be thought as an opening tag
 * symbol. The same is valid for <isscript> and <iscomment> tags;
 */

const ParseUtils     = require('./ParseUtils');
const ExceptionUtils = require('../util/ExceptionUtils');

const placeholderSymbol = '_';

const maskIgnorableContent = (content, shouldMaskBorders, templatePath) => {

    let maskedContent = content;

    maskedContent = maskInBetween(maskedContent, 'iscomment', shouldMaskBorders);
    maskedContent = maskExpressionContent(maskedContent);
    maskedContent = maskInBetween(maskedContent, '<!---', '--->', shouldMaskBorders);
    maskedContent = maskInBetween(maskedContent, '<!--', '-->', shouldMaskBorders);
    maskedContent = maskInBetweenIsscriptTags(maskedContent);
    maskedContent = maskInBetweenForTagWithAttributes(maskedContent, 'script', 'type=\'text/javascript\'');
    maskedContent = maskInBetweenForTagWithAttributes(maskedContent, 'script', 'type="text/javascript"');
    maskedContent = maskInBetweenForTagWithAttributes(maskedContent, 'isscript');

    checkTagBalance(maskedContent, content, templatePath);

    maskedContent = maskInBetweenForTagWithAttributes(maskedContent, 'script');
    maskedContent = maskInBetweenForTagWithAttributes(maskedContent, 'style');
    maskedContent = maskInBetween2(maskedContent, '<', '>');
    maskedContent = maskQuoteContent(maskedContent);
    maskedContent = maskIsifTagContent(maskedContent);
    maskedContent = maskIsprintTagContent(maskedContent);

    return maskedContent;
};

const checkTagBalance = (maskedContent, content, templatePath) => {
    let depth = 0;

    for (let globalPos = 0; globalPos < maskedContent.length; globalPos++) {
        const char             = maskedContent[globalPos];
        const remainingContent = maskedContent.substring(globalPos);

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
            const lineNumber = ParseUtils.getLineBreakQty(content.substring(0, globalPos)) + 1;

            throw ExceptionUtils.invalidCharacterError(
                '<',
                lineNumber,
                globalPos,
                1,
                templatePath
            );
        }
    }
};

const maskInBetween = (content, startString, endString, shouldMaskBorders) => {

    let processedStartingString = startString;
    let processedEndString      = endString;

    if (!endString) {
        processedStartingString = startString === 'isif' ? `<${startString}` : `<${startString}>`;
        processedEndString      = `</${startString}>`;
    }

    return getMatchingIndexes(content, processedStartingString, processedEndString, shouldMaskBorders);
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

const maskInBetweenForTagWithAttributes = (content, rawStartString, attributes = '') => {

    const startingString = `<${rawStartString + (attributes ? ' ' + attributes : '')}>`;
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

// TODO Rename and reuse;
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
        arrayIndex      : null
    };

    const isDeprecatedIsmlCommentUnbalanced = checkIfDeprecatedIsmlCommentIsUnbalanced(content, startString, openingMatchList, closingMatchList);

    if (isDeprecatedIsmlCommentUnbalanced) {
        return isDeprecatedIsmlCommentUnbalanced;
    }

    for (let i = 0; i < content.length; ++i) {
        if (isInBetween) {
            if (closingMatchList.indexOf(i) >= 0) {
                currentOpeningTag.endingGlobalPos = null;
                isInBetween                       = false;
                result                            += content[i];
            } else {
                result      += placeholderSymbol;
            }
        } else {
            const firstMatchPos = openingMatchList.indexOf(i - 1);
            if (firstMatchPos >= 0) {
                currentOpeningTag.endingGlobalPos = i;
                currentOpeningTag.arrayIndex      = firstMatchPos;
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

const maskQuoteContent = content => {

    let maskedContent  = '';
    let isWithinQuotes = false;

    for (let i = 0; i < content.length; i++) {
        const char = content[i];

        maskedContent += isWithinQuotes ?
            '_' :
            char;

        if (char === '"') {
            isWithinQuotes = !isWithinQuotes;

            if (!isWithinQuotes) {
                maskedContent = maskedContent.slice(0, -1);
                maskedContent += '"';
            }
        }
    }

    return maskedContent;
};

// TODO Try to generalize this function;
const maskIsifTagContent = content => {

    const openingTag  = '<isif';
    const closingTag  = '</isif>';
    let depthLevel    = 0;
    let maskedContent = '';

    for (let i = 0; i < content.length; i++) {
        const remainingContent = content.substring(i);

        if (remainingContent.startsWith(openingTag)) {
            maskedContent += depthLevel > 0 ? '_____' : openingTag;
            i             += openingTag.length;
            depthLevel++;
        }

        maskedContent += depthLevel > 0 ?
            '_' :
            content[i];

        if (remainingContent.startsWith(closingTag)) {
            depthLevel--;
            maskedContent += depthLevel > 0 ? '_______' : closingTag;
            i             += closingTag.length - 1;
        }
    }

    return maskedContent;
};

const maskIsprintTagContent = content => {

    const openingTag       = '<isprint';
    let isWithinIsprintTag = false;
    let maskedContent      = '';

    if (content.indexOf(openingTag) < 0) {
        return content;
    }

    for (let i = 0; i < content.length; i++) {
        const remainingContent = content.substring(i);
        const char             = content[i];

        if (remainingContent.startsWith(openingTag)) {
            isWithinIsprintTag = true;
            maskedContent      += openingTag;
            i                  += openingTag.length;
        }

        maskedContent += isWithinIsprintTag ?
            '_' :
            char;

        if (char === '>' && isWithinIsprintTag) {
            isWithinIsprintTag = !isWithinIsprintTag;

            if (!isWithinIsprintTag) {
                maskedContent = maskedContent.slice(0, -1);
                maskedContent += '>';
            }
        }
    }

    return maskedContent;
};

const maskExpressionContent = content => {
    const openingTag       = '${';
    const closingTag       = '}';
    let isWithinExpression = false;
    let maskedContent      = '';

    for (let i = 0; i < content.length; i++) {
        const remainingContent = content.substring(i);

        if (remainingContent.startsWith(openingTag)) {
            isWithinExpression = true;
            maskedContent      += openingTag;
            i                  += openingTag.length;

            if (remainingContent.startsWith('${}')) {
                isWithinExpression = false;
                maskedContent      += '}';
                continue;
            }
        }

        maskedContent += isWithinExpression ?
            '_' :
            content[i];

        if (remainingContent.startsWith(closingTag)) {
            isWithinExpression = false;
            maskedContent      = maskedContent.slice(0, -1) + closingTag;
        }
    }

    return maskedContent;
};

const maskJsonContent = content => {
    let maskedContent = '';
    let depth         = 0;

    for (let i = 0; i < content.length; i++) {
        const char = content[i];

        if (char === '}') {
            depth -= 1;
        }

        maskedContent += depth > 0 ?
            '_' :
            char;

        if (char === '{') {
            depth += 1;
        }
    }

    return maskedContent;
};

module.exports = {
    maskIgnorableContent,
    maskQuoteContent,
    maskExpressionContent,
    maskIsprintTagContent,
    maskJsonContent,
    maskIsifTagContent,
    maskInBetween,
    maskInBetween2,
    maskInBetweenForTagWithAttributes
};
