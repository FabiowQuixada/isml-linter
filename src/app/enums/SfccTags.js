const TAG_DATA = {
    'isactivedatacontext' : {
        'attributes': {
            'category' : {
                'required': true
            }
        }
    },
    'isactivedatahead' : {
        'within' : ['head']
    },
    'isanalyticsoff' : {},
    'isbreak' : {
        'within' : ['isloop']
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
        }
    },
    'iscomment': {},
    'iscomponent': {
        'attributes': {
            'pipeline'   : {
                'required' : true
            },
            'locale'     : {},
            'parameterN' : {}
        }
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
        }
    },
    'iscontinue' : {
        'within' : ['isloop']
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
        }
    },
    'isdecorate' : {
        'attributes': {
            'template' : {
                'required' : true
            }
        }
    },
    'iselse': {
        'condition' : {}
    },
    'isif': {
        'condition' : {}
    },
    'iselseif': {
        'condition' : {}
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
        }
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
        }
    },
    'isnext' : {
        'within' : ['isloop']
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
        // TODO Are they really mutually exclusive?
        // },
        // 'requires' : {
        //     'exclusive': ['style', 'formatter']
        }
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
        }
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
        }
    },
    'isreplace' : {
        'within' : ['isdecorate']
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
        }
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
        }
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
        }
    },
    'isstatus' : {
        'attributes': {
            'value' : {
                'required' : true
            }
        }
    }
};

module.exports = TAG_DATA;
