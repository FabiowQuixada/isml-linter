# "leading-iscache" Rule

Ensures that &lt;iscache> tag is always among the first elements of the template, after &lt;iscontent> tag, if they are present.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);<br/>
- Auto-fixable;

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"leading-iscache": {}
```

For the above configuration, the following scenarios may happen:

```
// Invalid;
<!DOCTYPE html>
<iscache status="on" />
```

```
// Valid;
<iscache status="on" />
<!DOCTYPE html>
```

```
// Valid;
<iscontent type="text/html" charset="UTF-8" compact="true" />
<iscache status="on" />
<!DOCTYPE html>
```

[generic-config]: <../generic-rule-config.md>
