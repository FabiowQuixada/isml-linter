# "empty-eof" Rule

Enforces an empty line at the end of the template.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"empty-eof": {}
```

For the above configuration, the following scenarios may happen:

```
<div>${value}</div> // Invalid, no empty line;
```

```
<div>${value}</div> 
// Valid, empty line with no blank spaces;
```

```
<div>${value}</div> 
...    // Invalid, blank spaces are present;
```

[generic-config]: <../generic-rule-config.md>
