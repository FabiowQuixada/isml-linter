const path      = require('path');
const FileUtils = require('./FileUtils');
const Constants = require('../Constants');

const DB_DIRECTORY  = path.join(Constants.linterModuleDir, 'db');
const DB_FILENAME   = 'database.json';
const DATABASE_PATH = path.join(DB_DIRECTORY, DB_FILENAME);
let dbData;

const emptyDBStructure = {
    lastLintVersion      : '',
    configFileLastLinted : '',
    templates            : {
        // '' : {
        //     lastLinted : '',
        //     lintResult : ''
        // }
    }
};

const initDb = () => {
    if (FileUtils.fileExists(DATABASE_PATH)) {
        const rawData = require(DATABASE_PATH);

        dbData  = {
            configFileLastLinted : new Date(rawData.configFileLastLinted),
            templates            : {}
        };

        for (const templatePath in rawData.templates) {
            const rawTemplateData = rawData.templates[templatePath];

            dbData.templates[templatePath] = {
                lastLinted : new Date(rawTemplateData.lastLinted),
                lintResult : rawTemplateData.lintResult
            };
        }

    } else {
        dbData = emptyDBStructure;
        FileUtils.createDirIfDoesNotExist(DB_DIRECTORY);
        FileUtils.saveToJsonFile(DB_DIRECTORY, DB_FILENAME, dbData);
    }
};

const loadData = () => {
    return dbData.templates;
};

const insertOrReplaceData = (path, lastLinted, lintResult) => {
    dbData.templates[path] = {
        lastLinted,
        lintResult
    };
};

const getConfigFileModificationDate = () => {
    return dbData.configFileLastLinted;
};

const updateConfigDate = lastModified => {
    dbData.configFileLastLinted = lastModified;
};

const closeDb = () => {
    FileUtils.saveToJsonFile(DB_DIRECTORY, DB_FILENAME, dbData);
};

module.exports.initDb                        = initDb;
module.exports.loadData                      = loadData;
module.exports.insertOrReplaceData           = insertOrReplaceData;
module.exports.getConfigFileModificationDate = getConfigFileModificationDate;
module.exports.updateConfigDate              = updateConfigDate;
module.exports.closeDb                       = closeDb;
