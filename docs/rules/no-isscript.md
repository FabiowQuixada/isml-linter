# "no-isscript" Rule

Disallows `<isscript />` tags in templates. As a best practice, keep logic in separate _.js_ files and then require them.

## :exclamation: Deprecated
Consider using "[disallow-tags][disallow-tags]" rule instead.

## Notes

- This rule does **not** dependent on abstract tree build;

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"no-isscript": {}
```

For the above configuration, the following scenarios may happen:

```
<isscript> // Invalid;
    var OrderMgr = require('dw/order/OrderMgr');
</isscript>
```

[generic-config]: <../generic-rule-config.md>
[disallow-tags]: <./disallow-tags.md>
