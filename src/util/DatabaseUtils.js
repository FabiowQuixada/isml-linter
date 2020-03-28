const path      = require('path');
const Database  = require('better-sqlite3');
const FileUtils = require('./FileUtils');

const { parseISOString } = require('./GeneralUtils');

const DB_DIRECTORY  = 'db';
const DATABASE_PATH = path.join(DB_DIRECTORY, 'isml-linter.db');
let db;

const initDb = (dbPath = DATABASE_PATH) => {

    FileUtils.createDirIfDoesNotExist(DB_DIRECTORY);

    db = new Database(dbPath);

    db.prepare(`CREATE TABLE IF NOT EXISTS TEMPLATE_DATA(
        PATH        TEXT PRIMARY KEY,
        LAST_LINTED DATE NOT NULL,
        LINT_RESULT TEXT NOT NULL
    );`).run();

    db.prepare(`CREATE TABLE IF NOT EXISTS CONFIGURATION_FILE(
        ID          INTEGER PRIMARY KEY AUTOINCREMENT,
        LAST_LINTED DATE NOT NULL
    );`).run();
};

const loadData = () => {
    const queryResult = db.prepare('SELECT * FROM TEMPLATE_DATA').all();
    const dbData      = {};

    if (queryResult) {
        for (let i = 0; i < queryResult.length; i++) {
            const templateRow = queryResult[i];
            const lastLinted  = parseISOString(templateRow.LAST_LINTED);
            const lintResult  = JSON.parse(templateRow.LINT_RESULT);

            dbData[templateRow.PATH] = {
                lastLinted,
                lintResult
            };
        }
    }

    return dbData;
};

const insertOrReplaceData = (path, lastLinted, parseData) => {
    const statement = db.prepare(`INSERT OR REPLACE INTO TEMPLATE_DATA
        (PATH, LAST_LINTED, LINT_RESULT) VALUES
        (?, ?, ?)`);

    statement.run(path, lastLinted.toISOString(), JSON.stringify(parseData));
};

const getConfigFileModificationDate = () => {
    const queryResult = db.prepare('SELECT * FROM CONFIGURATION_FILE').get();

    return queryResult &&
        queryResult.LAST_LINTED &&
        parseISOString(queryResult.LAST_LINTED);
};

const updateConfigDate = lastModified => {
    const statement = db.prepare(`INSERT OR REPLACE INTO CONFIGURATION_FILE 
        (ID, LAST_LINTED) VALUES 
        (1, ?)`);

    statement.run(lastModified.toISOString());
};

const closeDb = () => db.close();

module.exports.initDb                        = initDb;
module.exports.loadData                      = loadData;
module.exports.insertOrReplaceData           = insertOrReplaceData;
module.exports.getConfigFileModificationDate = getConfigFileModificationDate;
module.exports.updateConfigDate              = updateConfigDate;
module.exports.closeDb                       = closeDb;
