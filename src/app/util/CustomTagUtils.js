const fs        = require('fs');
const Constants = require('../Constants');

const templatePath       = Constants.specTemplateDir + '/util/modules.isml';
const customTagContainer = {};

if (fs.existsSync(templatePath)) {
    const ismoduleTagArray = fs
        .readFileSync(templatePath, 'utf-8')
        .replace(/\n/g, '')
        .split('/>');

    for (let j = 0; j < ismoduleTagArray.length; j++) {
        const ismoduleTag = ismoduleTagArray[j];
        const attrArray   = ismoduleTag.replace(/\t/g, ' ').split(' ').slice(1);
        const tag         = {
            attrList : []
        };

        for (let i = 0; i < attrArray.length; i++) {
            const stringifiedAttr = attrArray[i];

            const attr = stringifiedAttr.split('=');
            const val  = attr[1].substring(1, attr[1].length - 1);

            attr[0] === 'attribute' ?
                tag.attrList.push(val) :
                tag[attr[0]] = val;
        }

        customTagContainer['is' + tag.name] = tag;
    }
}

module.exports = customTagContainer;
