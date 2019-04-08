# "enforce-require" Rule

Enforces API classes to be called through `require()` function, which means it disallows direct usage, such as `dw.order.OrderMgr`.

## Notes

- This rule does **not** dependent on abstract tree build;

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"enforce-require": {}
```

For the above configuration, the following scenarios may happen:

```
// Invalid;
<isset name="basket" value="${dw.order.Basket}" scope="page"/>
```

```
// Valid;
<isset name="basket" value="${require('dw/order/Basket')}" scope="page"/>
```

[generic-config]: <../generic-rule-config.md>
