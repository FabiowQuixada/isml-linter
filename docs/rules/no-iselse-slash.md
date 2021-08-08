# "no-iselse-slash" Rule

Disallows self-closing `<iselse>` and `<iselseif>` tags.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);
- Auto-fixable;

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].


## Examples

```js
"no-iselse-slash": {}
```

For the above configuration, the following scenarios may happen:

```
<isif condition="${aCondition}">
<iselseif condition="${anotherCondition}"/> // Invalid;
<iselse/>                                   // Invalid;
</isif>
```

```
<isif condition="${aCondition}">
<iselseif condition="${anotherCondition}"> // Valid;
<iselse>                                   // Valid;
</isif>
```

[generic-config]: <../generic-rule-config.md>
