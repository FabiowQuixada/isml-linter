
module.exports = {
    getInitialState : function(contentAsArray, parentState, parentNode) {

        const regex = /\n/gi;
        let result = regex.exec(contentAsArray);
        let lineBreakPosition = 0;
        const state = {

            content: contentAsArray.replace(/(\r\n\t|\n|\r\t)/gm, ''),
            contentAsArray: contentAsArray,
            currentElement: {
                asString: '',
                initPosition: -1,
                endPosition: -1,
                startingLineNumber: -1
            },
            lineBreakPositionList: [0],
            currentLineNumber: 1,
            currentChar: null,
            currentPos: -1,
            ignoreUntil: null,
            insideTag: false,
            nonTagBuffer: '',
            insideExpression: false,
            depth: 0,
            parentState,
            parentNode
        };

        if (parentState) {
            state.currentLineNumber = parentState.currentLineNumber;
            state.node = parentState.parentNode.newestChildNode;
        }

        while (result) {
            lineBreakPosition = result.index - state.lineBreakPositionList.length + 1;
            state.lineBreakPositionList.push(lineBreakPosition);
            result = regex.exec(contentAsArray);
        }

        return state;
    },

    reinitializeState : function(state) {
        state.insideTag = false;
        state.currentElement.asString = '';
        state.currentElement.initPosition = -1;
        state.currentElement.endPosition = -1;
    }
};
