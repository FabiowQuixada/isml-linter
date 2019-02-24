# "no-isscript" Rule

Disallows &lt;isscript /> tags in templates. As a best practice, keep logic in separate `.js` files and then require them.

## Notes

- This rule does **not** dependent on abstract tree build;

## Configuration

No configuration is available for this rule.

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
