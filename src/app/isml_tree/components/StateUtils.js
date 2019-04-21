const ParseUtils = require('./ParseUtils');

module.exports = {
    getInitialState(content, parentState, parentNode, filePath) {

        const state = {
            content,
            parentState,
            parentNode,
            filePath,
            currentElement        : {},
            lineBreakPositionList : [0],
            closingElementsStack  : [],
            currentLineNumber     : 1,
            currentChar           : null,
            currentPos            : -1,
            ignoreUntil           : null,
            nonTagBuffer          : '',
            insideExpression      : false,
            depthColor            : ParseUtils.DEPTH_COLOR.WHITE
        };

        this.initializeCurrentElement(state);

        if (parentState) {
            state.currentLineNumber = parentState.currentLineNumber;
            state.node              = parentState.parentNode.newestChildNode;
        }

        const regex        = /\n/gi;
        let lineBreakMatch = regex.exec(content);
        while (lineBreakMatch) {
            const lineBreakPosition = lineBreakMatch.index - state.lineBreakPositionList.length + 1;
            state.lineBreakPositionList.push(lineBreakPosition);
            lineBreakMatch          = regex.exec(content);
        }

        return state;
    },

    initializeCurrentElement(state) {
        state.currentElement.asString           = '';
        state.currentElement.initPosition       = -1;
        state.currentElement.endPosition        = -1;
        state.currentElement.startingLineNumber = -1;
    }
};
