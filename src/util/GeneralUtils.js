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

const getActiveLineBreak = () => {
    const config          = ConfigUtils.load();
    const configLineBreak = config.linebreakStyle && Constants.lineBreak[config.linebreakStyle];

    return configLineBreak || Constants.EOL;
};

const getFileLineBreakStyle = templateContent => {
    const indexOfLF = templateContent.indexOf(Constants.lineBreak.unix, 1);

    if (indexOfLF === -1) {
        if (templateContent.indexOf('\r') !== -1) {
            return '\r';
        }

        return Constants.lineBreak.unix;
    }

    if (templateContent[indexOfLF - 1] === '\r') {
        return Constants.lineBreak.windows;
    }

    return Constants.lineBreak.unix;
};

module.exports.formatTemplatePath = filePath => {
    return filePath.replace(/\//g, path.sep);
};

module.exports.toLF = content => {
    return content.replace(/\r\n/g, Constants.lineBreak.unix);
};

module.exports.getFileLineBreakStyle = getFileLineBreakStyle;

module.exports.applyLineBreak = (content, lineBreak) => {
    const config                      = ConfigUtils.load();
    const configLineBreak             = config.linebreakStyle && Constants.lineBreak[config.linebreakStyle];
    const templateHasWindowsLineBreak = content.indexOf(Constants.lineBreak.windows) >= 0;

    if (configLineBreak) {
        lineBreak = configLineBreak;
    }

    if (lineBreak === Constants.lineBreak.windows && !templateHasWindowsLineBreak) {
        return content
            .replace(new RegExp(Constants.lineBreak.unix, 'g'), lineBreak);
    } else if (lineBreak === Constants.lineBreak.unix && templateHasWindowsLineBreak) {
        return content
            .replace(new RegExp(Constants.lineBreak.windows, 'g'), lineBreak);
    }

    return content;
};

module.exports.applyActiveLineBreaks = content => {
    const activeLineBreak = getActiveLineBreak();

    return content
        .replace(new RegExp(Constants.lineBreak.windows, 'g'), activeLineBreak)
        .replace(new RegExp(Constants.lineBreak.unix, 'g'), activeLineBreak);
};

module.exports.parseISOString = isoString => {
    const isoArray = isoString.split(/\D+/);
    return new Date(Date.UTC(isoArray[0], --isoArray[1], isoArray[2], isoArray[3], isoArray[4], isoArray[5], isoArray[6]));
};

module.exports.getActiveLineBreak = getActiveLineBreak;

module.exports.mergeDeep = mergeDeep;
