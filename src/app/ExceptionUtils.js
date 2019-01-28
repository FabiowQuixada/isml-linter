
const getUnbalancedMessage = (elementType, lineNumber) => {
    return `Invalid ISML DOM :: Unbalanced <${elementType}> element at line ${lineNumber}`;
};

module.exports = {
    getUnbalancedMessage: getUnbalancedMessage
};
