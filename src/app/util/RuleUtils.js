const path      = require('path');
const fs        = require('fs');
const Constants = require('../Constants');

const lineByLineRules = [];
const treeRules       = [];

fs.readdirSync(Constants.lineByLineRulesDir)
    .filter( file => file.endsWith('.js'))
    .forEach( file => {
        const rulePath = path.join(__dirname, '..', 'rules', 'line_by_line', file);
        lineByLineRules.push(require(rulePath));
    });

fs.readdirSync(Constants.treeRulesDir)
    .filter( file => file.endsWith('.js'))
    .forEach( file => {
        const rulePath = path.join(__dirname, '..', 'rules', 'tree', file);
        treeRules.push(require(rulePath));
    });

module.exports = {
    getAllLineRules     : () => lineByLineRules,
    getEnabledLineRules : () => lineByLineRules.filter( rule => rule.isEnabled() ),
    getEnabledTreeRules : () => treeRules.filter( rule => rule.isEnabled() )
};