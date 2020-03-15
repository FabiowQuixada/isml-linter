const path        = require('path');
const Constants   = require('../Constants');
const ConfigUtils = require('./ConfigUtils');

const isObject = item => {
    return item && typeof item === 'object' && !Array.isArray(item);
};

const mergeDeep  = (target, ...sources) => {
    if (!sources.length) {
        return target;
    }

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
};

const getActiveLinebreak = () => {
    const config          = ConfigUtils.load();
    const configLineBreak = config.linebreakStyle && Constants.lineBreak[config.linebreakStyle];

    return configLineBreak || Constants.EOL;
};

module.exports.formatTemplatePath = filePath => {
    return filePath.replace(/\//g, path.sep);
};

module.exports.toLF = content => {
    return content.replace(/\r\n/g, '\n');
};

module.exports.applyActiveLinebreaks = content => {
    const activeLinebreak = getActiveLinebreak();

    return content
        .replace(new RegExp(Constants.lineBreak.windows, 'g'), activeLinebreak)
        .replace(new RegExp(Constants.lineBreak.unix, 'g'), activeLinebreak);
};

module.exports.parseISOString = isoString => {
    const isoArray = isoString.split(/\D+/);
    return new Date(Date.UTC(isoArray[0], --isoArray[1], isoArray[2], isoArray[3], isoArray[4], isoArray[5], isoArray[6]));
};

module.exports.getActiveLinebreak = getActiveLinebreak;

module.exports.mergeDeep = mergeDeep;
