const dir = require('../config.json').dir.rootTemplate;

require('./app/IsmlLinter').lint(dir);
