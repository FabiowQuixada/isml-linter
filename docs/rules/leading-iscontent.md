# "leading-iscontent" Rule

Ensures that &lt;iscontent> tag is always among the first four elements of the template, if present.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);<br/>
- Auto-fixable;

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"leading-iscontent": {}
```

For the above configuration, the following scenarios may happen:

```
// Invalid;
<!DOCTYPE html>
<iscontent type="text/html" charset="UTF-8" compact="true" />
```

```
// Valid;
<iscontent type="text/html" charset="UTF-8" compact="true" />
<!DOCTYPE html>
```

[generic-config]: <../generic-rule-config.md>
