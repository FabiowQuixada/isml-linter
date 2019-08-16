# "align-isset" Rule

Aligns contiguous &lt;isset> tags attributes' columns

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"align-isset": {}
```

For the above configuration, the following scenarios may happen:

```
// Valid;
<isset name="someName"       value="${someValue}"       scope="page"/>
<isset name="anotherName"    value="${anotherValue}"    scope="page"/>
<isset name="yetAnotherName" value="${yetAnotherValue}" scope="page"/>

```

```
// Invalid;
<isset name="someName" value="${someValue}" scope="page"/>
<isset name="anotherName" value="${anotherValue}" scope="page"/>
<isset name="yetAnotherName" value="${yetAnotherValue}" scope="page"/>

```

[generic-config]: <../generic-rule-config.md>
