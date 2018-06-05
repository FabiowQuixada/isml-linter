/**
 * Replaces '${...}' with '______', so it facilites next processes. For Example,
 * if ${ 3 < 4 } is present, the '<' symbol might be thought as an opening tag
 * symbol. The same is valid for <isscript> and <iscomment> tags;
 */
const maskIgnorableContent = oldState => {

    let newState = Object.assign({}, oldState);
    let content = newState.content;

    content = replaceContentOfFirstWrappingTag(content, '${', '}');
    content = replaceContentOfFirstWrappingTag(content, '<isscript>', '</isscript>');
    content = replaceContentOfFirstWrappingTag(content, '<iscomment>', '</iscomment>');

    newState.content = content;
    newState = maskNestedIsmlElements(newState);

    return newState;
};

/**
 * Masks nested isml elements so that they don't interfere with the Isml Dom tree building;
 *
 * An example, it turns:
 *      <div <isif ... > class="wrapper">
 * into:
 *      <div ___________ class="wrapper">
 */
const maskNestedIsmlElements = oldState => {

    const newState = Object.assign({}, oldState);
    let result = '';
    let depth = 0;
    let firstTime = true;

    for (let i = 0; i < newState.content.length; i++) {
        const currentChar = newState.content.charAt(i);

        if (currentChar === '<') {
            depth += 1;
        }

        if (newState.content.charAt(i-1) === '>') {
            depth -= 1;
        }

        if (depth > 1) {
            result += '_';
        } else {
            result += newState.content.charAt(i);
        }

        if (depth === 0 && firstTime) {
            newState.currentElemEndPosition = i;
            firstTime = false;
        }
    }

    newState.content = result;

    return newState;
};

const replaceContentOfFirstWrappingTag = (content, startString, endString) => {

    const placeholderSymbol = '_';
    let result = content;

    const startStringPos = result.indexOf(startString);
    const endStringPos = result.indexOf(endString);

    if (startStringPos !== -1 && endStringPos !== -1) {
        const startStringEndPos = startStringPos + startString.length;
        const endStringStartPos = endStringPos-1;
        let placeholder = '';

        for (let i = startStringEndPos; i <= endStringStartPos; i++) {
            placeholder += placeholderSymbol;
        }

        result = result.substring(0, startStringEndPos) +
                 placeholder +
                 result.substring(endStringStartPos+1, result.length+1);
    }

    return result;
};

module.exports ={
    maskNestedIsmlElements,
    maskIgnorableContent
};
