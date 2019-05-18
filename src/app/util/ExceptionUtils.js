const Constants = require('../Constants');

const types = {
    UNKNOWN_ERROR    : 'UNKNOWN_ERROR',
    INVALID_TEMPLATE : 'INVALID_TEMPLATE',
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

const parseError = templatePath => {
    return {
        message  : `An unexpected error happenned while parsing ${templatePath}. Please report it to ${Constants.repositoryUrl} and add the file to the ignore list while a fix is not available.`,
        isCustom : true,
        type     : types.UNKNOWN_ERROR
    };
};

const isLinterException = e => e && e.isCustom;

module.exports = {
    parseError,
    unbalancedElementError,
    isLinterException,
    types
};
