# "no-inline-style" Rule

Disallows in-line stylings.

## Notes

- This rule does **not** dependent on abstract tree build;

## Configuration

No configuration is available for this rule.

## Examples

```js
"no-inline-style": {}
```

For the above configuration, the following scenarios may happen:

```
<div style="background-color:powderblue;"> // Invalid 
    $10.00
</div>
```
