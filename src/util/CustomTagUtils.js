const fs        = require('fs');
const path      = require('path');
const Constants = require('../Constants');

const templatePath       = path.join(Constants.specTemplateDir, 'util', 'modules.isml');
const customTagContainer = {};

if (fs.existsSync(templatePath)) {
    const ismoduleTagArray = fs
        .readFileSync(templatePath, 'utf-8')
        .replace(new RegExp(Constants.OS_EOL, 'g'), '')
        .split('/>');

    for (let j = 0; j < ismoduleTagArray.length; j++) {
        const ismoduleTag = ismoduleTagArray[j];

        if (ismoduleTag) {

            const attrArray = ismoduleTag
                .replace(/\t/g, ' ')
                .split(' ')
                .slice(1)
                . filter( line => line );

            const tag       = {
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
}

module.exports = customTagContainer;
