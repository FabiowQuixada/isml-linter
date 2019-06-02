# "contextual-attrs" Rule

Disallows presence of mutually exclusive attributes and checks for attributes that are conditionally required.

## Notes
- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].


## Examples

```js
"contextual-attrs": {}
```

For the above configuration, the following scenarios may happen:

```
<isinclude template="abc" url="def" /> // Invalid, "template" and "url" attributes
                                       // cannot be present simultaneously;
```

```
<isinclude template="abc" />  // Valid;
```

```
<isslot context="category" /> // Invalid, if "category" value is defined for "context" attribute, 
                              // another attribute must be present: "context-object";
```

```
<isslot context="category" context-object="someCategory" />  // Valid;
```

[generic-config]: <../generic-rule-config.md>
