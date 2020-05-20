const Constants = require('../Constants');

const types = {
    UNKNOWN_ERROR                    : 'UNKNOWN_ERROR',
    UNCLOSED_DEPRECATED_ISML_COMMENT : 'UNCLOSED_DEPRECATED_ISML_COMMENT',
    INVALID_TEMPLATE                 : 'INVALID_TEMPLATE',
    INVALID_CHARACTER                : 'INVALID_CHARACTER',
    NO_CONFIG                        : 'NO_CONFIG',
};

const unbalancedElementError = (elementType, lineNumber, globalPos, length, templatePath) => {
    return {
        message      : `Unbalanced <${elementType}> element`,
        templatePath : templatePath,
        globalPos,
        length,
        lineNumber   : lineNumber,
        isCustom     : true,
        type         : types.INVALID_TEMPLATE
    };
};

const unclosedDeprecatedIsmlComment = (lineNumber, globalPos, length, templatePath) => {
    return {
        message      : '"<!---" element not correctly closed: use "--->" instead of "-->"',
        templatePath : templatePath,
        globalPos,
        length,
        lineNumber   : lineNumber,
        isCustom     : true,
        type         : types.UNCLOSED_DEPRECATED_ISML_COMMENT
    };
};

const invalidCharacterError = (character, lineNumber, globalPos, length, templatePath) => {
    return {
        message      : `Invalid character "${character}" found at ${templatePath}:${lineNumber}.`,
        templatePath : templatePath,
        globalPos,
        length,
        lineNumber   : lineNumber,
        isCustom     : true,
        type         : types.INVALID_CHARACTER
    };
};

const parseError = (elementType, lineNumber, globalPos, length, templatePath) => {
    return {
        message      : `An unexpected error happened while parsing element ${elementType} at ${templatePath}:${lineNumber}.`,
        templatePath : templatePath,
        globalPos,
        length,
        lineNumber   : lineNumber,
        isCustom     : true,
        type         : types.UNKNOWN_ERROR
    };
};

const noConfigError = () => {
    return {
        message  : `No configuration found. Please run the following command: ${Constants.EOL}${Constants.EOL}\t./node_modules/.bin/isml-linter --init${Constants.EOL}${Constants.EOL}`,
        isCustom : true
    };
};

const noEslintConfigError = () => {
    return {
        message  : 'No eslint configuration found. Please add an ESLint configuration file and try again.',
        isCustom : true
    };
};

const emptyException = () => {
    return {
        isCustom : true
    };
};

const isLinterException = e => e && e.isCustom;

module.exports = {
    parseError,
    unclosedDeprecatedIsmlComment,
    unbalancedElementError,
    invalidCharacterError,
    noConfigError,
    noEslintConfigError,
    emptyException,
    isLinterException,
    types
};
