const ParseUtils = require('./ParseUtils');

module.exports = {
    getInitialState : function(originalContent, parentState, parentNode, filePath) {

        const regex           = /\n/gi;
        let result            = regex.exec(originalContent);
        let lineBreakPosition = 0;
        const state           = {
            content               : originalContent.replace(/(\r\n\t|\n|\r\t)/gm, ''),
            originalContent       : originalContent,
            filePath              : filePath,
            currentElement        : {
                asString           : '',
                initPosition       : -1,
                endPosition        : -1,
                startingLineNumber : -1
            },
            lineBreakPositionList : [0],
            closingElementsStack  : [],
            currentLineNumber     : 1,
            currentChar           : null,
            currentPos            : -1,
            ignoreUntil           : null,
            nonTagBuffer          : '',
            insideExpression      : false,
            depthColor            : ParseUtils.DEPTH_COLOR.WHITE,
            parentState,
            parentNode
        };

        if (parentState) {
            state.currentLineNumber = parentState.currentLineNumber;
            state.node              = parentState.parentNode.newestChildNode;
        }

        while (result) {
            lineBreakPosition = result.index - state.lineBreakPositionList.length + 1;
            state.lineBreakPositionList.push(lineBreakPosition);
            result            = regex.exec(originalContent);
        }

        return state;
    },

    reinitializeState : function(state) {
        state.currentElement.asString     = '';
        state.currentElement.initPosition = -1;
        state.currentElement.endPosition  = -1;
    }
};
