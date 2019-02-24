# "no-br" Rule

Disallows &lt;br/> tags. Use this rule if you want to handle vertical spacing via CSS.

## Notes

- This rule does **not** dependent on abstract tree build;

## Configuration

No configuration is available for this rule.

## Examples

```js
"no-br": {}
```

For the above configuration, the following scenarios may happen:

```
<div>
    <br/> // Invalid;
</div>
```
