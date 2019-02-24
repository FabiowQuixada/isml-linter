# "enforce-isprint" Rule

Enforces any hardcoded string or ISML expression to be wrapped in a &lt;isprint /> tag.

## Notes

- Dependent on abstract tree build (global "disableTreeParse" configuration must **not** be true);

## Configuration

No configuration is available for this rule.

## Examples

```js
"enforce-isprint": {}
```

For the above configuration, the following scenarios may happen:

```
<div clas="price"> 
    ${price}  // Invalid;
</div>
```

```
<div clas="price"> 
    <isprint value="${price}" ... /> // Valid;
</div>
```
