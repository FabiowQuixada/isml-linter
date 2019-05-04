// Please check all available configutations and rules
// at https://www.npmjs.com/package/isml-linter.

const config = {
    'rules': {

        // Line by line rules;
        'enforce-isprint'     : {},
        'enforce-require'     : {},
        'no-br'               : {},
        'no-git-conflict'     : {},
        'no-import-package'   : {},
        'no-inline-style'     : {},
        'no-isscript'         : {},
        'no-space-only-lines' : {},
        'no-tabs'             : {},
        'no-trailing-spaces'  : {},

        // Tree rules;
        'indent'               : {},
        'max-depth'            : {},
        'no-embedded-isml'     : {},
        'no-hardcode'          : {},
        'no-require-in-loop'   : {},
        'one-element-per-line' : {}
    }
};

module.exports = config;
