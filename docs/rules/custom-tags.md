# "custom-tags" Rule

Checks if "util/modules" template is actually needed or if it is missing.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].


## Examples

```js
"custom-tags": {}
```

For the above configuration, the following scenarios may happen:

```
<isinclude template="util/modules" /> // Valid;
<ismycustommodule />
```

```
<isinclude template="util/modules" /> // Invalid, no modules used in the template;
```

```
<ismycustommodule /> // Invalid, "util/modules" not included;
```

[generic-config]: <../generic-rule-config.md>
