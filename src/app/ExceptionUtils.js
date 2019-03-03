const Constants = require('./Constants');

const types = {
    UNKNOWN_ERROR    : 'UNKNOWN_ERROR',
    INVALID_TEMPLATE : 'INVALID_TEMPLATE'
};

const getUnbalancedMessage = (elementType, lineNumber) => {
    return `Invalid ISML DOM :: Unbalanced <${elementType}> element at line ${lineNumber}`;
};

const getParseErrorMessage = fileName => {
    return `An unexpected error happenned while parsing ${fileName}. Please report it to ${Constants.repositoryUrl} and add the file to the ignore list while a fix is not available.`;
};

module.exports = {
    getParseErrorMessage : getParseErrorMessage,
    getUnbalancedMessage : getUnbalancedMessage,
    types
};
