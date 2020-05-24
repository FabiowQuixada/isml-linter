# "enforce-isprint" Rule

Enforces any hardcoded string or ISML expression to be wrapped in a &lt;isprint /> tag.

## Known Bug
"enforce-isprint" has a known bug that will be fixed only on version 6.0.0, as it will introduce breaking changes.

## Notes

- This rule does **not** dependent on abstract tree build;

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"enforce-isprint": {}
```

For the above configuration, the following scenarios may happen:

```
<div class="price"> 
    ${price}  // Invalid;
</div>
```

```
<div class="price"> 
    <isprint value="${price}" ... /> // Valid;
</div>
```

[generic-config]: <../generic-rule-config.md>
