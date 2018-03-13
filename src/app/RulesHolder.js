const normalizedPath = require('path').join(__dirname, 'rules');
let rules = [];

require('fs').readdirSync(normalizedPath).forEach( file => {
    rules.push(require('./rules/' + file));
});

module.exports = {
    rules
};
