# "no-require-in-loop" Rule

Disallows `require()` calls within loops in the same template.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);

## Configuration

No configuration is available for this rule. Check the [Generic Configurations for Rules][generic-config].

## Examples

```js
"no-require-in-loop": {}
```

For the above configuration, the following scenarios may happen:

```
<isloop ...>
    // Invalid;
    <isset name="OrderMgr" value="${require('dw/order/OrderMgr')}" scope="page"/> 
</isloop>
```

```
// Valid;
<isset name="OrderMgr" value="${require('dw/order/OrderMgr')}" scope="page"/>

<isloop ...>
    ...
</isloop>
```

[generic-config]: <../generic-rule-config.md>
