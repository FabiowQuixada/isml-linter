const SingleLineRulePrototype = require('../prototypes/SingleLineRulePrototype');

const ruleId         = require('path').basename(__filename).slice(0, -3);
const description    = 'Avoid using inline style';
const occurrenceText = ' style="';

const Rule = Object.create(SingleLineRulePrototype);

Rule.init(ruleId, description);

Rule.isBroken = function(line) {
    const shouldAllowWhenDynamic = this.getConfigs().allowWhenDynamic;

    if (line.indexOf(occurrenceText) >= 0) {
        if (shouldAllowWhenDynamic && line.indexOf('${') >= 0) {
            const attributePos      = line.indexOf(occurrenceText);
            const tagClosingCharPos = line.substring(attributePos).indexOf('>');
            const expressionPos     = line.substring(tagClosingCharPos).indexOf('${');

            if (attributePos >= 0 && tagClosingCharPos >= 0 && expressionPos >= 0 &&
                attributePos < tagClosingCharPos && tagClosingCharPos < expressionPos
            ) {
                return true;
            }

            if (attributePos === -1 || tagClosingCharPos === -1 || expressionPos === -1) {
                return false;
            }
        }

        return line.indexOf('<isprint') === -1;
    }

    return false;
};

Rule.getDefaultAttrs = () => {
    return {
        allowWhenDynamic: true
    };
};

Rule.getColumnNumber = function(line) {
    return Math.max(line.indexOf(occurrenceText), 0) + 2;
};

Rule.getFirstOccurrence = function(line) {

    let result = null;

    if (this.isBroken(line)) {

        const matchPos = line.indexOf(occurrenceText);

        result = {
            globalPos : matchPos + 1,
            length    : occurrenceText.length - 3
        };
    }

    return result;
};

module.exports = Rule;
