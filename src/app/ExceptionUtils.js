const Constants = require('./Constants');

const LINTER_EXCEPTION = 'Linter Exception';
const types            = {
    UNKNOWN_ERROR      : 'UNKNOWN_ERROR',
    INVALID_TEMPLATE   : 'INVALID_TEMPLATE',
};

const unbalancedElementError = (elementType, lineNumber, templatePath) => {
    return {
        message      : `Unbalanced <${elementType}> element`,
        templatePath : templatePath,
        lineNumber   : lineNumber,
        type         : LINTER_EXCEPTION,
        subtype      : types.INVALID_TEMPLATE
    };
};

const parseError = fileName => {
    return {
        message : `An unexpected error happenned while parsing ${fileName}. Please report it to ${Constants.repositoryUrl} and add the file to the ignore list while a fix is not available.`,
        type    : LINTER_EXCEPTION,
        subtype : types.UNKNOWN_ERROR
    };
};

const isLinterException = e => {
    return e.type && e.type === LINTER_EXCEPTION;
};

module.exports = {
    parseError,
    unbalancedElementError,
    isLinterException,
    types,
    LINTER_EXCEPTION
};
