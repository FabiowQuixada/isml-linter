const FileUtils = require('./FileUtils');
const Constants = require('./Constants');
const RulesHolder = require('./RulesHolder');

const ENTRY_TYPES = {
    ERROR: 'errors',
    WARNING: 'warnings',
    INFO: 'info'
};

const outputFileName = Constants.outputFileName;
const compiledOutputFileName = Constants.compiledOutputFileName;

const getProcessedFilePath = fileName => {
    return fileName.substring(fileName.indexOf('default') + 8);
};

const add = (parser, type, rule, fileName, result) => {
    parser.output = parser.output || {};
    parser.output[type] = parser.output[type] || {};
    parser.output[type][rule.description] = parser.output[type][rule.description] || {};
    parser.output[type][rule.description][fileName] = parser.output[type][rule.description][fileName] || [];

    if (result.occurrences) {
        result.occurrences.forEach( res => {
            parser.output[type][rule.description][fileName].push(res);
        });
    }
};

const parse = fileName => {
    const that = this;

    RulesHolder.getEnabledRules().forEach( rule => {
        const result = rule.check(fileName);

        if (result.occurrences.length) {
            const processedFilePath = getProcessedFilePath(fileName);
            add(that, ENTRY_TYPES.ERROR, rule, processedFilePath, result);
        }
    });

    return this.output;
};

const compileOutput = (dir, content) => {
    if (content) {
        let total = 0;
        const compiledOutput = {};

        Object.keys(content).forEach( type => {

            compiledOutput[type] = compiledOutput[type] || {};

            Object.keys(content[type]).forEach( error => {
                compiledOutput[type][error] = 0;

                Object.keys(content[type][error]).forEach( file => {
                    Object.keys(content[type][error][file]).forEach( () => {
                        compiledOutput[type][error] += 1;
                        total += 1;
                    });
                });
            });
        });

        compiledOutput.total = total;

        FileUtils.saveToJsonFile(dir, compiledOutputFileName, compiledOutput);
    }
};

const orderOutputByRuleDescription = parser => {
    const orderedOutput = {};

    Object.keys(parser.output).sort().forEach( level => {
        orderedOutput[level] = {};

        Object.keys(parser.output[level]).sort().forEach( ruleDesc => {
            orderedOutput[level][ruleDesc] = parser.output[level][ruleDesc];
        });
    });

    parser.output = orderedOutput;
};

const FileParser = {
    parse,
    cleanOutput : () => this.output = {},
    getOutput   : () => this.output || {},
    saveToFile  : dir => { FileUtils.saveToJsonFile(dir, outputFileName, this.output); },
    compileOutput: dir => { compileOutput(dir, this.output); },
    orderOutputByRuleDescription : () => { orderOutputByRuleDescription(this); },
    ENTRY_TYPES
};

module.exports = FileParser;
