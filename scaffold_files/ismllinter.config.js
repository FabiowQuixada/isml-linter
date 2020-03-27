// Please check all available configurations and rules
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
        'max-lines'           : {},

        // Tree rules;
        'indent'               : {},
        'leading-iscontent'    : {},
        'max-depth'            : {},
        'no-embedded-isml'     : {},
        'no-hardcode'          : {},
        'no-require-in-loop'   : {},
        'one-element-per-line' : {},
        'leading-iscache'      : {},
        'no-deprecated-attrs'  : {},
        'contextual-attrs'     : {},
        'custom-tags'          : {},
        'eslint-to-isscript'   : {},
        'no-iselse-slash'      : {},
        'empty-eof'            : {},
        'align-isset'          : {},
        'disallow-tags'        : {},

        // Other
        'lowercase-filename' : {}
    }
};

module.exports = config;
