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

const findNodeOfType = (node, type) => {
    let result = null;

    node.getChildren().some( child => {
        if (child.isOfType(type)) {
            result = child;
            return true;
        } else {
            result = findNodeOfType(child, type) || result;
        }

        return false;
    });

    return result;
};

const isTypeAmongTheFirstElements = (rootNode, type) => {
    let result = false;

    for (let i = 0; i < Constants.leadingElementsChecking; i++) {
        result = result ||
            rootNode.getChild(i) &&
            rootNode.getChild(i).isOfType(type);
    }

    return result;
};

module.exports.getAllLineRules             = () => lineByLineRules;
module.exports.getEnabledLineRules         = () => lineByLineRules.filter( rule => rule.isEnabled() && rule.name !== 'lowercase-filename');
module.exports.getEnabledTreeRules         = () => treeRules.filter( rule => rule.isEnabled() );
module.exports.findNodeOfType              = findNodeOfType;
module.exports.isTypeAmongTheFirstElements = isTypeAmongTheFirstElements;
