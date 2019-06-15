const fs        = require('fs');
const Constants = require('../Constants');

const templatePath       = Constants.specTemplateDir + '/util/modules.isml';
const customTagContainer = {};

if (fs.existsSync(templatePath)) {
    fs.readFileSync(templatePath, 'utf-8')
        .replace(/\n/g, '')
        .split('/>')
        .filter( value => value.trim())
        .forEach( value => {
            const tag = {
                attrList : []
            };
            value
                .replace(/\t/g, ' ')
                .split(' ')
                .slice(1)
                .forEach( stringifiedAttr => {
                    const attr = stringifiedAttr.split('=');
                    const val  = attr[1].substring(1, attr[1].length - 1);

                    attr[0] === 'attribute' ?
                        tag.attrList.push(val) :
                        tag[attr[0]] = val;
                });

            customTagContainer['is' + tag.name] = tag;
        });
}

module.exports = customTagContainer;
