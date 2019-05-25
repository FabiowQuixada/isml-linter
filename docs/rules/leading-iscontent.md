# "leading-iscontent" Rule

Ensures that &lt;iscontent> tag is always the first element of the template, if present.

## Notes

- This rule depends on abstract tree build;

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
