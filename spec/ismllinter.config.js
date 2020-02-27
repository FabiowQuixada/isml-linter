// Please check all available configurations and rules
// at https://www.npmjs.com/package/isml-linter.

const config = {
    'env'               : 'test',
    'ignoreUnparseable' : true,
    'rootDir'           : './cartridges',
    'ignore'            : [
        'this_directory_is_to_be_ignored',
        'Email.isml'
    ],
    'rules': {
        'no-br'               : {},
        'enforce-require'     : {},
        'no-import-package'   : {},
        'enforce-isprint'     : {},
        'no-trailing-spaces'  : {},
        'no-space-only-lines' : {},
        'no-inline-style'     : {},
        'no-isscript'         : {
            'ignore' : ['pt_']
        },
        'no-hardcode'         : {},
        'no-require-in-loop'  : {
            'ignore': ['pt_']
        },
        'no-tabs'             : {},
        'max-depth'           : {
            level : 'warning',
            value : 10
        },
        'lowercase-filename'  : {
            level : 'warning'
        },
        'custom-tags'         : {
            level : 'info'
        },
    }
};

module.exports = config;
