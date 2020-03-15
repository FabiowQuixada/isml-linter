// Please check all available configurations and rules
// at https://www.npmjs.com/package/isml-linter.

const config = {
    'enableCache' : true,
    'rules': {

        // Line by line rules;
        'enforce-isprint'     : {
            level : 'warning'
        },
        'enforce-require'     : {},
        'no-br'               : {},
        'no-git-conflict'     : {},
        'no-import-package'   : {},
        'no-inline-style'     : {
            level : 'warning'
        },
        'no-isscript'         : {},
        'no-space-only-lines' : {},
        'no-tabs'             : {},
        'no-trailing-spaces'  : {},

        // Tree rules;
        'indent'               : {},
        'max-depth'            : {
            level : 'warning'
        },
        'no-embedded-isml'     : {},
        'no-hardcode'          : {},
        'no-require-in-loop'   : {},
        'one-element-per-line' : {}
    }
};

module.exports = config;
