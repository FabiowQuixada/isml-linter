const TAG_DATA = {
    'isactivedatacontext' : {
        'attributes': {
            'category' : {
                'required': true
            }
        },
        'self-closing' : true
    },
    'isactivedatahead' : {
        'within' : ['head'],
        'self-closing' : true
    },
    'isanalyticsoff' : {
        'self-closing' : true
    },
    'isbreak' : {
        'within' : ['isloop'],
        'self-closing' : true
    },
    'iscache' : {
        'attributes': {
            'status' : {
                'values'           : ['off', 'on'],
                'deprecatedValues' : ['off']
            },
            'type' : {
                'required' : true,
                'values'   : ['relative', 'daily']
            },
            'hour'   : {},
            'minute' : {},
            'varyby' : {},
            'if'     : {}
        },
        'self-closing' : true
    },
    'iscomment': {},
    'iscomponent': {
        'attributes': {
            'pipeline'   : {
                'required' : true
            },
            'locale'     : {},
            'parameterN' : {}
        },
        'self-closing' : true
    },
    'iscontent' : {
        'attributes': {
            'type'     : {},
            'charset'  : {},
            'encoding' : {
                'values' : ['on', 'off', 'html', 'xml', 'wml']
            },
            'compact'  : {
                'values': ['true', 'false']
            }
        },
        'self-closing' : true
    },
    'iscontinue' : {
        'within' : ['isloop'],
        'self-closing' : true
    },
    'iscookie' : {
        'attributes': {
            'name'    : {
                'required' : true
            },
            'value'   : {
                'required' : true
            },
            'comment' : {},
            'domain'  : {},
            'path'    : {},
            'maxAge'  : {},
            'version' : {},
            'secure'  : {
                'values' : ['on', 'off']
            }
        },
        'self-closing' : true
    },
    'isdecorate' : {
        'attributes': {
            'template' : {
                'required' : true
            }
        }
    },
    'iselse': {
        'attributes': {
            'condition' : {}
        },
        'self-closing' : true
    },
    'isif': {
        'attributes': {
            'condition' : {}
        }
    },
    'iselseif': {
        'attributes': {
            'condition' : {}
        },
        'self-closing' : true
    },
    'isinclude' : {
        'attributes': {
            'template': {},
            'url': {},
            'sf-toolkit' : {
                'values'        : ['on', 'off'],
                'default' : 'on'
            }
        },
        'requires' : {
            'exclusive': ['url', 'template']
        },
        'self-closing' : true
    },
    'isloop' : {
        'attributes': {
            'items'    : {},
            'iterator' : {},
            'alias'    : {},
            'var'      : {},
            'status'   : {},
            'begin'    : {},
            'end'      : {},
            'step'     : {}
        },
        'requires': {
            // TODO Non-exclusive?
            // 'non-exclusive' : ['items', 'iterator']
            // 'non-exclusive' : ['alias', 'var']
        }
    },
    'ismodule' : {
        'attributes': {
            'template'  : {
                'required' : true
            },
            'name'       : {
                'required' : true
            },
            'attribute': {}
        },
        'self-closing' : true
    },
    'isnext' : {
        'within' : ['isloop'],
        'self-closing' : true
    },
    'isobject' : {
        'attributes': {
            'object' : {
                'required' : true
            },
            'view'   : {
                'values' : ['none', 'searchhit', 'recommendation', 'setproduct', 'detail'],
                'required' : true
            }
        }
    },
    'isprint' : {
        'attributes': {
            'value' : {
                'required' : true
            },
            'style' : {},
            'formatter' : {},
            'timezone' : {
                'values' : ['SITE', 'INSTANCE', 'utc']
            },
            'padding' : {},
            'encoding' : {
                'values' : ['on', 'off'],
                'default' : 'on'
            }
        },
        'self-closing' : true
        // TODO Are they really mutually exclusive?
        // },
        // 'requires' : {
        //     'exclusive': ['style', 'formatter']
    },
    'isredirect' : {
        'attributes': {
            'location' : {
                'required' : true
            },
            'permanent' : {
                'values' : ['true', 'false'],
                'default': 'false'
            }
        },
        'self-closing' : true
    },
    'isremove' : {
        'attributes': {
            'name' : {
                'required' : true
            },
            'scope' : {
                'values' : ['session', 'request', 'page'],
                'deprecatedValues' : ['pdict']
            }
        },
        'self-closing' : true
    },
    'isreplace' : {
        'within' : ['isdecorate'],
        'self-closing' : true
    },
    'isscript' : {},
    'isselect' : {
        'attributes': {
            'name' : {
                'required' : true
            },
            'iterator' : {
                'required' : true
            },
            'description' : {
                'required' : true
            },
            'value' : {
                'required' : true
            },
            'condition' : {
                'values' : ['true', 'false']
            },
            'encoding' : {
                'values' : ['on', 'off']
            }
        },
        'self-closing' : true
    },
    'isset' : {
        'attributes': {
            'name' : {
                'required' : true
            },
            'value' : {
                'required' : true
            },
            'scope' : {
                'required' : true,
                'values' : ['session', 'request', 'page']
            }
        },
        'self-closing' : true
    },
    'isslot' : {
        'attributes': {
            'id' : {
                'required' : true
            },
            'context' : {
                'required' : true,
                'values'   : ['global', 'category', 'folder'],
                'requires' : {
                    'name'     : 'context-object',
                    'ifValues' : ['category', 'folder']
                }
            },
            'context-object' : {},
            'description' : {
                'required' : true
            },
            'preview-url' : {}
        },
        'self-closing' : true
    },
    'isstatus' : {
        'attributes': {
            'value' : {
                'required' : true
            }
        },
        'self-closing' : true
    }
};

module.exports = TAG_DATA;
