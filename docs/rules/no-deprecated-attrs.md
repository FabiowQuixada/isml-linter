# "no-deprecated-attrs" Rule

Disallows deprecated attributes or attribute values.

## Notes
- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].


## Examples

```js
"no-deprecated-attrs": {}
```

For the above configuration, the following scenarios may happen:

```
<iscache status="off" /> // Invalid;
```

```
<iscache status="on" />  // Valid;
```

[generic-config]: <../generic-rule-config.md>
