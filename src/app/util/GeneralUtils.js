const path = require('path');

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

module.exports.formatTemplatePath = filePath => {
    return filePath.replace(/\//g, path.sep);
};

module.exports.toLF = content => {
    return content.replace(/\r\n/g, '\n');
};

module.exports.mergeDeep = mergeDeep;
